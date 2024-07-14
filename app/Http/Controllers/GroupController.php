<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Jobs\DeleteGroupJob;
use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function destroy(Group $group)
    {
        if($group->owner_id !== auth()->id()) {
            abort(403);
        }

        DeleteGroupJob::dispatch($group)->delay(now()->addSeconds(10));

        return response()->json(['message' => 'Group delete was scheduled and will be deleted soon']);
    }

    public function store(StoreGroupRequest $request)
    {
        $data = $request->validated();
        $user_ids = $data['user_ids'] ?? [];
        $group = Group::create($data);
        $group->users()->attach(array_unique([$request->user()->id, ...$user_ids]));

        return redirect()->back();
    }

    public function update(UpdateGroupRequest $request, Group $group)
    {
        $data = $request->validated();
        $user_ids = $data['user_ids'] ?? [];
        $group->update($data);

        //remove all user and attach the new ones
        // $group->users()->detach();
        // $group->users()->attach(array_unique([$request->user()->id, ...$user_ids]));

        $group->users()->sync(array_unique([$request->user()->id, ...$user_ids]));

        return redirect()->back();
    }
}
