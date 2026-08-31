import Image from "next/image";

import mobileLogo from "@/app/assets/logo-mobile.svg";
import dropDown from "@/app/assets/icon-chevron-down.svg";
import addTaskIcon from "@/app/assets/icon-add-task-mobile.svg";
import ellipsis from "@/app/assets/icon-vertical-ellipsis.svg";

export default function Header() {
  return (
    <header className="flex w-full items-center justify-between bg-white p-4">
      
      <div className="flex items-center gap-3">
        <Image
          src={mobileLogo}
          width={24}
          height={25}
          alt=""
          className="md:hidden"
        />

        <h1 className="text-lg font-bold">Platform Launch</h1>

        <button
          type="button"
          aria-label="Open board selector"
        >
          <Image
            src={dropDown}
            width={10}
            height={5}
            alt=""
          />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Add new task"
          className="flex h-8 w-12 items-center justify-center gap-2 rounded-2xl bg-button-purple md:h-12 md:w-auto md:px-6"
        >
          <Image
            src={addTaskIcon}
            width={12}
            height={12}
            alt=""
          />

          <span className="hidden md:inline">Add New Task</span>
        </button>

        <button
          type="button"
          aria-label="Open board menu"
        >
          <Image
            src={ellipsis}
            width={5}
            height={16}
            alt=""
          />
        </button>
      </div>
    </header>
  )
}
