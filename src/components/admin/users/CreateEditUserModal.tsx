import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, UserRole, ROLE_OPTIONS } from '@/types/user';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect } from 'react';

const userSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  role: z.enum(['player', 'family', 'coach', 'club_admin', 'federation', 'government', 'admin']),
  clubId: z.string().optional(),
  sendWelcomeEmail: z.boolean(),
  isActive: z.boolean(),
  requireEmailVerification: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

interface CreateEditUserModalProps {
  user?: User | null;
  clubs: { id: string; name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: UserFormData) => void;
}

export function CreateEditUserModal({
  user,
  clubs,
  open,
  onOpenChange,
  onSave,
}: CreateEditUserModalProps) {
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      role: 'player',
      clubId: '',
      sendWelcomeEmail: true,
      isActive: true,
      requireEmailVerification: false,
    },
  });

  const selectedRole = watch('role');
  const showClubField = !['admin', 'federation', 'government'].includes(selectedRole);

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        clubId: user.clubId || '',
        sendWelcomeEmail: false,
        isActive: user.status === 'active',
        requireEmailVerification: false,
      });
    } else {
      reset({
        fullName: '',
        email: '',
        phone: '',
        role: 'player',
        clubId: '',
        sendWelcomeEmail: true,
        isActive: true,
        requireEmailVerification: false,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: UserFormData) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar usuario' : 'Crear usuario'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase">
              Información Básica
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo *</Label>
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder="Nombre y apellido"
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="usuario@email.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+54 11 1234-5678"
              />
            </div>
          </div>

          {/* Role and Permissions */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase">
              Rol y Permisos
            </h4>

            <div className="space-y-2">
              <Label>Rol *</Label>
              <Select
                value={selectedRole}
                onValueChange={(v) => setValue('role', v as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.filter((o) => o.value !== 'all').map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showClubField && (
              <div className="space-y-2">
                <Label>Club/Organización</Label>
                <Select
                  value={watch('clubId')}
                  onValueChange={(v) => setValue('clubId', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Buscar club..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin asignar</SelectItem>
                    {clubs.map((club) => (
                      <SelectItem key={club.id} value={club.id}>
                        {club.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase">
              Configuración
            </h4>

            <div className="space-y-3">
              {!isEditing && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="sendWelcomeEmail"
                    checked={watch('sendWelcomeEmail')}
                    onCheckedChange={(checked) =>
                      setValue('sendWelcomeEmail', checked as boolean)
                    }
                  />
                  <Label htmlFor="sendWelcomeEmail" className="font-normal">
                    Enviar email de bienvenida
                  </Label>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Checkbox
                  id="isActive"
                  checked={watch('isActive')}
                  onCheckedChange={(checked) =>
                    setValue('isActive', checked as boolean)
                  }
                />
                <Label htmlFor="isActive" className="font-normal">
                  Cuenta activa
                </Label>
              </div>

              {!isEditing && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="requireEmailVerification"
                    checked={watch('requireEmailVerification')}
                    onCheckedChange={(checked) =>
                      setValue('requireEmailVerification', checked as boolean)
                    }
                  />
                  <Label htmlFor="requireEmailVerification" className="font-normal">
                    Requiere verificación email
                  </Label>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Guardar cambios' : 'Crear usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
