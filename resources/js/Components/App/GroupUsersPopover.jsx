import React, { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { UsersIcon } from '@heroicons/react/20/solid'
import { Link } from '@inertiajs/react'
import UserAvatar from './UserAvatar'

const GroupUsersPopover = ({ users = [] }) => {
  return (
    <div className="max-w-sm">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                group inline-flex items-center rounded-md text-base font-medium text-gray-400 hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
            >
              <div className='tooltip tooltip-left' data-tip="List Users">
                <UsersIcon className='w-4'/>
              </div>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-20 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                  <div className="relative text-gray-100 bg-gray-800 p-2">
                    {users.map(user => (
                      <Link
                        href={route("chat.user", user.id)}
                        key={user.id}
                        className='flex items-center gap-2 py-2 px-3 hover:bg-black/30'
                      >
                        <UserAvatar user={user}/>
                        <div
                          className='text-xs'
                        >
                          {user.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

export default GroupUsersPopover