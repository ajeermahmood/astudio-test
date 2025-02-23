import { ArrowPathIcon as Spinner } from "@heroicons/react/24/outline";

interface LoadingOverlayProps {
  visible: boolean;
}

export default function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center space-y-4">
        <Spinner className="h-8 w-8 text-[#fdc936] animate-spin" />
        <p className="text-[#322625]">Loading...</p>
      </div>
    </div>
  );
}
