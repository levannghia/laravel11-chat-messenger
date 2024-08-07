<?php

namespace App\Http\Controllers;

use App\Events\PublicTest;
use App\Events\SocketMessage;
use App\Http\Requests\StoreMessengeRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function byUser(User $user)
    {
        $messages = Message::query()
            ->with(['attachments', 'sender'])
            ->whereNull('group_id')
            ->where(function ($query) use ($user) {
                $query->where('sender_id', auth()->id())
                    ->orWhere('sender_id', $user->id);
            })
            ->Where(function ($query) use ($user) {
                $query->Where('receiver_id', $user->id)
                    ->orWhere('receiver_id', auth()->id());
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('Home', [
            'selectedConversation' => $user->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }

    public function byGroup(Group $group)
    {
        $messages = Message::where('group_id', $group->id)
            ->with(['attachments', 'sender'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Home', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }

    public function loadOlder(Message $message)
    {
        // dd($message);
        if ($message->group_id) {
            $messages = Message::where('created_at', '<', $message->created_at)
                ->with(['attachments', 'sender'])
                ->where('group_id', $message->group_id)
                ->latest()
                ->paginate(10);
        } else {
            $messages = Message::where('created_at', '<', $message->created_at)
                // ->where(function ($query) use ($message) {
                //     $query->where('sender_id', $message->sender_id)
                //         ->where('receiver_id', $message->receiver_id)
                //         ->orWhere('receiver_id', $message->sender_id)
                //         ->orWhere('sender_id', $message->receiver_id);
                // })
                ->with(['attachments', 'sender'])
                ->where(function ($query) use ($message) {
                    $query->where('sender_id', $message->sender_id)
                        ->orWhere('sender_id', $message->receiver_id);
                })
                ->Where(function ($query) use ($message) {
                    $query->Where('receiver_id', $message->receiver_id)
                        ->orWhere('receiver_id', $message->sender_id);
                })
                ->latest()
                ->paginate(10);
        }

        return MessageResource::collection($messages);
    }

    public function store(StoreMessengeRequest $request)
    {
        $dt = Carbon::now();
        $year = $dt->year;
        $month = $dt->month;

        $data = $request->validated();
        $data['sender_id'] = auth()->id();
        $receiverId = $data['receiver_id'] ?? null;
        $groupId = $data['group_id'] ?? null;
        $files = $data['attachments'] ?? [];

        $message = Message::create($data);
        $attachments = [];

        if ($files) {
            foreach ($files as $file) {
                $directory = "attachments/$year/$month"; //. Str::random(32);
                Storage::makeDirectory($directory);

                $model = [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory, 'public'),
                ];

                $attachment = MessageAttachment::create($model);
                $attachments[] = $attachment;
            }

            $message->attachments = $attachments;
        }

        if ($receiverId) {
            Conversation::updateGroupWithMessage($receiverId, auth()->id(), $message);
        }

        if ($groupId) {
            Group::updateGroupWithMessage($groupId, $message);
        }

        $message = $message->load('attachments');
        SocketMessage::dispatch($message);
        event(new PublicTest(["user" => "user 1"]));
        // dd($message);
        return new MessageResource($message);
    }

    public function destroy(Message $message)
    {
        if ($message->sender_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $group = null;
        $conversation = null;
        $lastMessage = null;

        if ($message->group_id) {
            $group = Group::where('last_message_id', $message->id)->first();

        } else {
            $conversation = Conversation::where('last_message_id', $message->id)->first();
        }

        $message->delete();

        if ($group) {
            $group = Group::find($group->id);
            $lastMessage = $group->lastMessage;
        } elseif ($conversation) {
            $conversation = Conversation::find($conversation->id);
            $lastMessage = $conversation->lastMessage;
        }
        return response()->json([
            'message' => $lastMessage ? new MessageResource($lastMessage) : null
        ]);
    }
}
