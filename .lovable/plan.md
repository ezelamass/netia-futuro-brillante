

# Plan: Chat History with 5-Conversation Limit

## Current State
- Data model already supports multiple conversations per avatar (`ai_conversations` + `ai_messages`)
- But the UI only loads the **most recent** conversation per avatar, treating it as a single active chat
- "Nuevo chat" creates a new conversation but discards the old one from state

## Design

### UX Flow
1. When an avatar is selected, show a **chat history drawer/panel** (slide-out from left or dropdown) listing all saved conversations for that avatar
2. Each history item shows: title (first user message truncated), date, message count
3. User can tap a conversation to load it, or tap "Nuevo chat" to start fresh
4. When total conversations across ALL avatars reaches **5**, block "Nuevo chat" and show a message: "Eliminá una conversación para crear una nueva"
5. Each history item has a delete button (trash icon) with confirmation
6. Deleting removes the `ai_conversations` row (messages cascade via FK or manual delete)

### UI Components

**New: `ChatHistoryDrawer.tsx`**
- Sheet/drawer that opens from the ChatHeader (add a history icon button)
- Lists conversations for the selected avatar, sorted by `last_message_at` desc
- Shows conversation count badge: "3/5 chats"
- Each item: truncated title, relative date, delete button
- "Nuevo chat" button at top (disabled if at limit)

**Modified: `ChatHeader.tsx`**
- Add a clock/history icon button next to "Nuevo chat"
- Pass conversation count to disable "Nuevo chat" when at limit

**Modified: `Chat.tsx`**
- Load ALL conversations (not just most recent per avatar) on mount
- Track all conversation metadata in state: `allConversations: ConversationMeta[]`
- Add `activeConversationId` per avatar instead of just `dbConversationIds`
- Add `loadConversation(id)` to fetch and display a specific conversation's messages
- Add `deleteConversation(id)` to remove from DB and state
- Enforce 5-conversation cap in `getOrCreateConversation`

### Data Model
No schema changes needed. `ai_conversations` and `ai_messages` already support this. Messages reference conversations via `conversation_id`. We just need to stop ignoring old conversations.

### State Redesign in `Chat.tsx`

```text
Current:
  conversations: Record<AvatarId, ChatMessage[]>     // one per avatar
  dbConversationIds: Record<AvatarId, string | null>  // one ID per avatar

New:
  allConversations: ConversationMeta[]                // all user's conversations (max 5)
  activeConvoId: string | null                        // currently viewed conversation
  messages: ChatMessage[]                             // messages for active conversation
```

Where `ConversationMeta = { id, avatar, title, lastMessageAt, messageCount }`.

### Files to Create/Edit

1. **Create** `src/components/chat/ChatHistoryDrawer.tsx` -- Sheet listing conversations, delete buttons, new chat button, "3/5" counter
2. **Edit** `src/components/chat/ChatHeader.tsx` -- Add history toggle button, disable "Nuevo chat" at limit
3. **Edit** `src/pages/Chat.tsx` -- Refactor state to support multi-conversation, add load/delete/create logic with 5-cap enforcement

