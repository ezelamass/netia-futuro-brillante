import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { getCorsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller with anon client
    const anonClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: claimsData, error: claimsError } =
      await anonClient.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const callerId = claimsData.claims.sub as string;

    // Check admin role
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: isAdmin } = await adminClient.rpc("has_role", {
      _user_id: callerId,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action } = body;

    // CREATE USER
    if (action === "create") {
      const { email, password, fullName, phone, role, clubId, status } = body;

      const { data: authData, error: authError } =
        await adminClient.auth.admin.createUser({
          email,
          password: password || undefined,
          email_confirm: true,
          user_metadata: { full_name: fullName, role: role || "player" },
        });

      if (authError) {
        return new Response(JSON.stringify({ error: authError.message }), {
          status: 400,
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }

      const userId = authData.user.id;

      // Update profile with extra fields
      await adminClient
        .from("profiles")
        .update({
          phone: phone || null,
          status: status || "active",
        })
        .eq("id", userId);

      // Enroll in club if provided
      if (clubId) {
        await adminClient.from("enrollments").insert({
          user_id: userId,
          club_id: clubId,
          role: role || "player",
          status: "active",
        });
      }

      return new Response(
        JSON.stringify({ success: true, userId }),
        {
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        }
      );
    }

    // DELETE USER (soft delete: set inactive + delete auth)
    if (action === "delete") {
      const { userId } = body;

      // Soft delete: mark profile as inactive
      await adminClient
        .from("profiles")
        .update({ status: "inactive" })
        .eq("id", userId);

      // Hard delete from auth
      const { error: deleteError } =
        await adminClient.auth.admin.deleteUser(userId);

      if (deleteError) {
        return new Response(
          JSON.stringify({ error: deleteError.message }),
          {
            status: 400,
            headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        }
      );
    }

    // RESET PASSWORD
    if (action === "reset_password") {
      const { email } = body;

      const { error: resetError } =
        await adminClient.auth.admin.generateLink({
          type: "recovery",
          email,
        });

      if (resetError) {
        return new Response(
          JSON.stringify({ error: resetError.message }),
          {
            status: 400,
            headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      {
        status: 400,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      }
    );
  }
});
