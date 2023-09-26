import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";

export default function DropdownMenu({ menuButton, links }) {
  return (
    <div className="text-right">
      <Menu as="div" className="relative inline-block text-left">
        {menuButton}
        {links != undefined ? (
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1 ">
                {links.map((el) => (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-emerald-500 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={async () =>
                          el["onClick"] != null ? await el["onClick"]() : null
                        }
                      >
                        <div className={`${active ? "" : "text-emerald-500"}`}>
                          {el["icon"]}
                        </div>
                        {el["text"]}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        ) : (
          <></>
        )}
      </Menu>
    </div>
  );
}
