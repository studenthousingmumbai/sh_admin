import Link from "next/link"; 

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
  
export default function Example({ current, tabs, setCurrent }) {
    return (
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            // defaultValue={tabs.find((tab) => tab.name === current).name}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <Link href={tab.href} key={tab.name} onClick={() => setCurrent(tab.name)}> 
                     <a
                        key={tab.name}
                        className={classNames(
                            current === tab.name
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                        )}
                        aria-current={current === tab.name ? 'page' : undefined}
                    >
                        {tab.name}
                    </a>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    )
}