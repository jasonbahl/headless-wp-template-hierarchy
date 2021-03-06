/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, useEffect } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import DynamicHeroIcon from '../DynamicHeroIcon/DynamicHeroIcon'
import { ChevronDownIcon } from '@heroicons/react/solid'
import SiteLogo from '../SiteLogo/SiteLogo'
import { Link } from '@remix-run/react'
import { ThemeSelect, ThemeToggle } from '../ThemeToggle/ThemeToggle'

const docs = [
  {
    name: 'Getting Started',
    description: 'Get up and running with WPGraphQL',
    href: '/docs/introduction/',
    icon: 'CursorClickIcon',
  },
  {
    name: 'Beginner Guides',
    description: 'Learn the basics of GraphQL and using it with WordPress',
    href: '/docs/intro-to-graphql/',
    icon: 'BookOpenIcon',
  },
  {
    name: 'Using WPGraphQL',
    description: 'Learn the details of using WPGraphQL',
    href: '/docs/posts-and-pages/',
    icon: 'ChartBarIcon',
  },
  {
    name: 'Advanced Concepts',
    description: "Dig deeper into WPGraphQL's features",
    href: '/docs/concepts/',
    icon: 'ShieldCheckIcon',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    window.onscroll = function () {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
  }, [])

  return (
    <Popover
      className={
        scrolled
          ? `relative bg-white sticky top-0 z-50 shadow-xl dark:bg-slate-800`
          : `relative bg-white sticky top-0 z-50 dark:bg-slate-800 border-b-2 border-b-gray-100 dark:border-b-slate-800`
      }
    >
      <div className="max-w-8xl mx-auto flex justify-between items-center px-4 py-4 sm:px-6 md:justify-start md:space-x-10">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <Link to="/">
            <span className="sr-only">WPGraphQL</span>
            <div className="h-8 w-auto sm:h-10">
              <SiteLogo />
            </div>
          </Link>
        </div>
        <div className="-mr-2 -my-2 md:hidden">
          <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 dark:bg-slate-900">
            <span className="sr-only">Open menu</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </Popover.Button>
        </div>
        <Popover.Group as="nav" className="hidden md:flex space-x-10">
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button
                  className={classNames(
                    open ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-100',
                    'group bg-white dark:bg-slate-800 rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-200'
                  )}
                >
                  <span>Docs</span>
                  <ChevronDownIcon
                    className={classNames(
                      open ? 'text-gray-600' : 'text-gray-400',
                      'ml-2 h-5 w-5 group-hover:text-gray-500'
                    )}
                    aria-hidden="true"
                  />
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
                  <Popover.Panel className="absolute z-50 -ml-4 mt-3 transform w-screen max-w-md lg:max-w-2xl lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                      <div className="relative grid gap-6 bg-white dark:bg-slate-700 px-5 py-6 sm:gap-8 sm:p-8 lg:grid-cols-2">
                        {docs.map((solution) => (
                          <Link
                            key={solution.name}
                            to={solution.href}
                            className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600"
                          >
                            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white sm:h-12 sm:w-12">
                              <DynamicHeroIcon
                                icon={solution.icon}
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="ml-4">
                              <p className="text-base font-medium text-gray-900 dark:text-gray-200">
                                {solution.name}
                              </p>
                              <p className="mt-1 text-sm text-gray-700 dark:text-slate-100">
                                {solution.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="p-5 bg-gray-100 sm:p-8 dark:bg-slate-800">
                        <Link
                          to="/docs/contributing/"
                          className="-m-3 p-3 flow-root rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <div className="flex items-center">
                            <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                              Contribute
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
                            Help make WPGraphQL better for everyone.
                          </p>
                        </Link>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
          <Link to="/developer-reference" className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">
            Developer Reference
          </Link>
          <Link to="/extensions" className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">
            Extensions
          </Link>
          <Link to="/blog" className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">
            Blog
          </Link>
        </Popover.Group>
        <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
          <ThemeToggle />
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute z-50 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
        >
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50 dark:bg-slate-800">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div className="h-8 w-auto">
                  <Link to="/">
                    <SiteLogo />
                  </Link>
                </div>
                <div className="-mr-2">
                  <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 dark:bg-slate-900">
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid grid-cols-1 gap-7">
                  {docs.map((solution) => (
                    <a
                      key={solution.name}
                      href={solution.href}
                      className="-m-3 p-3 flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900"
                    >
                      <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-indigo-600 text-white">
                        <DynamicHeroIcon
                          icon={solution.icon}
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-4 text-base font-medium text-gray-900 dark:text-white">
                        {solution.name}
                      </div>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

export default SiteHeader
