import { HexColorPicker } from "react-colorful";

const ColorPicker = ({ color, onChange }) => {
    //   const [color, setColor] = useState("#aabbcc");
    return <div className="w-fit rounded-b-lg shadow-lg">
        <HexColorPicker color={color} onChange={(color) => onChange(color)} />
        <div className="py-2 text-center bg-white">
            {/* <label className="">Hex</label> */}
            <input className="mx-2 mt-2 border-b-gray-500 focus:border-b-gray-700 focus:border-b-2 mb-1 p-1 rounded-md text-center border border-gray-300 outline-none" 
                onChange={(e) => onChange(e.target.value)} value={color}></input>
        </div>
    </div>;
};

export default ColorPicker;