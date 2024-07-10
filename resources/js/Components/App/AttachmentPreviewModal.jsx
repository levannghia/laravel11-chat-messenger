import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { isPriviewable } from '@/helpers';

const AttachmentPreviewModal = ({ index, attachments, show = false, onClose = () => { } }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(index)
  }, [index])

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

  const maxWidth = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
  }[maxWidth]

  return (
    <Transition appear show={isOpen} as={Fragment}>
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

      </Dialog>
    </Transition>
  )
}

export default AttachmentPreviewModal