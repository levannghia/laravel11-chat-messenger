<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function changeRole(User $user)
    {
        $user->update(['is_admin' => !(bool) $user->is_admin]);
        $message = "User role was change into " . ($user->is_admin ? 'Admin' : 'Regular User');

        return response()->json([
            'message' => $message,
        ]);
    }

    public function blockUnblock(User $user)
    {
        if($user->blocked_at){
            $user->blocked_at = null;
            $message = 'User ' . $user->name. ' has been activated';
        } else {
            $user->blocked_at = now();
            $message = 'User ' .$user->name. ' has been blocked';
        }

        $user->save();

        return response()->json(['message' => $message]);
    }
}
