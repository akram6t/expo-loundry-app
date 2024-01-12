import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const defaultInput = () => (
    <div>
        <label htmlFor="defaultInput" className="text-sm text-gray-600">
            Default Input
        </label>
        <input
            id="defaultInput"
            type="text"
            name="defaultInput"
            // onChange={(e) => setEmail(e.target.value)}
            className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
            placeholder="Default Input"
        />
    </div>
);
export const largeInput = () => (
    <div className="">
        <label htmlFor="largeInput" className="text-sm text-gray-600">
            Large Input
        </label>
        <input
            id="largeInput"
            type="text"
            name="largeInput"
            // onChange={(e) => setEmail(e.target.value)}
            className="text-xl placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
            placeholder="Large Input"
        />
    </div>
);
export const inputWithIcon = () => (
    <div className="relative">
        <label
            htmlFor="inputWithIcon"
            className="text-sm text-gray-600"
        >
            Input with Icon
        </label>

        <div className="inline-flex items-center justify-center absolute left-0 top-[0.85rem] h-full w-10 text-gray-400">
            <FontAwesomeIcon icon={faPhone} />
        </div>
        <input
            id="inputWithIcon"
            type="text"
            name="inputWithIcon"
            // onChange={(e) => setEmail(e.target.value)}
            className="text-sm placeholder-gray-500 pl-10 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
            placeholder="Input With Icon"
        />
    </div>
);


// Buttons
export const PrimaryButton = () => (<button className="bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
    Primary Button
</button>);

export const SecondaryButton = () => (
    <button className="text-emerald-600 border border-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
        Secondary Button
    </button>);

export const OutlinedButton = () => (
    <button className="text-emerald-600 border border-emerald-300 px-3 py-2 rounded-lg shadow-lg text-sm">
        Outlined Button
    </button>);

export const PrimaryIconButton = ({ text, icon = faFloppyDisk }) => (
    <button className="bg-emerald-600 border-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm flex gap-2 items-center">
        <div>
            <FontAwesomeIcon icon={faFloppyDisk} />
        </div>
        <span>{text}</span>
    </button>
)