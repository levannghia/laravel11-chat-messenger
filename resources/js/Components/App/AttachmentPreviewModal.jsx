import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { isAudio, isImage, isPDF, isPriviewable, isVideo } from '@/helpers';
import { ChevronLeftIcon, ChevronRightIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/solid';

const AttachmentPreviewModal = ({ index, attachments, show = false, onClose = () => { } }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(index)
  }, [index])

  console.log(currentIndex);

  const attachment = useMemo(() => {
    return attachments[currentIndex];
  }, [attachments, currentIndex])

  const previewableAttachments = useMemo(() => {
    return attachments.filter((attachment) => isPriviewable(attachment))
  }, [attachments])

  const close = () => {
    onClose();
  }

  const prev = () => {
    if (currentIndex === 0) {
      return;
    }

    setCurrentIndex(currentIndex - 1);
  }

  const next = () => {
    if (currentIndex === previewableAttachments.length - 1) {
      return;
    }

    setCurrentIndex(currentIndex + 1);
  }

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>
        <div className='fixed inset-0 overflow-y-auto'>
          <div className='h-screen w-screen'>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-full flex flex-col max-w-md transform overflow-hidden bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                <button
                  onClick={close}
                  className='absolute right-3 top-3 w-10 h-10 rounded-full hover:bg-black/10 transition flex items-center justify-center text-gray-100 z-40'
                >
                  <XMarkIcon className='w-6 h-6' />
                </button>
                <div className='relative group h-full'>
                  {currentIndex > 0 && (
                    <div
                      onClick={prev}
                      className='absolute opacity-100 text-gray-100 cursor-pointer flex items-center justify-center w-16 h-16 left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 z-30'
                    >
                      <ChevronLeftIcon className='w-12' />
                    </div>
                  )}

                  {currentIndex < previewableAttachments.length - 1 && (
                    <div
                      onClick={next}
                      className='absolute opacity-100 text-gray-100 cursor-pointer flex items-center justify-center w-16 h-16 right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 z-30'
                    >
                      <ChevronRightIcon className='w-12' />
                    </div>
                  )}

                  {attachment && (
                    <div
                      className='flex items-center justify-center w-full h-full p-3'
                    >
                      {isImage(attachment) && (
                        <img src={attachment.url} alt="" className='max-w-full max-h-full' />
                      )}

                      {isVideo(attachment) && (
                        <video src={attachment.url} controls autoPlay />
                      )}

                      {isAudio(attachment) && (
                        <audio src={attachment.url} controls autoPlay />
                      )}

                      {isPDF(attachment) && (
                        <iframe src={attachment.url} className='w-full h-full'/>
                      )}

                      {!isPriviewable(attachment) && (
                        <div
                          className='p-32 justify-center items-center flex flex-col text-gray-100 '
                        >
                          <PaperClipIcon className='w-10 h-10 mb-3'/>
                          <small>{attachment.name}</small>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default AttachmentPreviewModal