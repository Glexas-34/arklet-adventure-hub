import { ShieldX } from "lucide-react";

interface BannedScreenProps {
  isVisible: boolean;
}

export function BannedScreen({ isVisible }: BannedScreenProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="text-center p-8">
        <ShieldX className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-red-400 mb-2">Your user is banned</h1>
        <p className="text-muted-foreground">Contact an admin if you believe this is a mistake.</p>
      </div>
    </div>
  );
}
