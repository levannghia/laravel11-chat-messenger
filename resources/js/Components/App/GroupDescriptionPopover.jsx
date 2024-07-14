import React, { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { DocumentMinusIcon } from '@heroicons/react/20/solid'

const GroupDescriptionPopover = ({ description }) => {
  return (
    <div className="max-w-sm">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                group inline-flex items-center rounded-md text-base font-medium text-gray-400 hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
            >
              <div className='tooltip tooltip-left' data-tip="Description">
                <DocumentMinusIcon className='w-4'/>
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
              <Popover.Panel className="absolute left-1/2 z-30 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                  <div className="relative text-gray-100 bg-gray-800 p-4">
                    {description ? (
                      <div className='text-xs'>
                        {description}
                      </div>
                    ) : (
                      <div className='text-xs text-gray-400 text-center'>
                        No description is define
                      </div>
                    )}
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

export default GroupDescriptionPopover