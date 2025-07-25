import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  PhotoIcon,
  PencilIcon,
  ShareIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
  CogIcon,
  SparklesIcon,
  BookOpenIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../lib/utils'

interface SidebarProps {
  open: boolean
  onClose: () => void
  currentPath: string
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Product Builder', href: '/builder', icon: DocumentTextIcon },
  { name: 'Templates', href: '/templates', icon: BookOpenIcon },
  { name: 'Meme Generator', href: '/meme-generator', icon: PhotoIcon },
  { name: 'Blog Generator', href: '/blog-generator', icon: PencilIcon },
  { name: 'Social Media', href: '/social-media', icon: ShareIcon },
  { name: 'Export Center', href: '/export', icon: ArchiveBoxIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
]

const quickActions = [
  { name: 'AI Auto-Fill', description: 'Generate content instantly', icon: SparklesIcon },
  { name: 'Quick Export', description: 'Export in multiple formats', icon: RocketLaunchIcon },
]

export function Sidebar({ open, onClose, currentPath }: SidebarProps) {
  const navigate = useNavigate()

  const SidebarContent = () => (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">AI Builder</h1>
            <p className="text-xs text-gray-500">Content Suite</p>
          </div>
        </div>
      </div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      currentPath === item.href
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium'
                    )}
                  >
                    <item.icon
                      className={cn(
                        currentPath === item.href ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                        'h-6 w-6 shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">Quick Actions</div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {quickActions.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      // Handle quick actions
                      if (item.name === 'AI Auto-Fill') {
                        navigate('/builder')
                      } else if (item.name === 'Quick Export') {
                        navigate('/export')
                      }
                      onClose()
                    }}
                    className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium w-full text-left"
                  >
                    <item.icon
                      className="text-gray-400 group-hover:text-indigo-600 h-6 w-6 shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </li>
          
          <li className="mt-auto">
            <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
              <div className="flex items-center space-x-3">
                <SparklesIcon className="w-6 h-6" />
                <div>
                  <p className="text-sm font-medium">Pro Features</p>
                  <p className="text-xs opacity-90">Unlock advanced AI models</p>
                </div>
              </div>
              <button className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors">
                Upgrade Now
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={onClose}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}