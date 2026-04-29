import { useDispatch } from "react-redux";
import { carsApi } from "../redux/features/carSell/carSellApi";

export const DebugReset = () => {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(carsApi.util.resetApiState())}
      className="p-2 bg-red-500 text-white"
    >
      Reset Cache
    </button>
  );
};