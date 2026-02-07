 import { useState } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { Search, ArrowLeftRight, Check, X, AlertCircle, Users, Circle } from "lucide-react";
 import { Input } from "@/components/ui/input";
 import { Button } from "@/components/ui/button";
 import { InventoryItem, rarityColors, rarityGlowColors } from "@/data/gameData";
 import { TradeOffer } from "@/hooks/useTrading";

 interface OnlinePlayer {
   nickname: string;
   online_at: string;
 }

 interface TradeViewProps {
   inventory: Record<string, InventoryItem>;
   nickname: string | null;
   partnerNickname: string | null;
   isTrading: boolean;
   myOffers: TradeOffer[];
   theirOffers: TradeOffer[];
   tradeAccepted: boolean;
   partnerAccepted: boolean;
   onInitiateTrade: (targetNickname: string) => Promise<{ success: boolean; error?: string }>;
   onAddItem: (item: InventoryItem) => void;
   onRemoveItem: (itemName: string) => void;
   onAcceptTrade: () => void;
   onDeclineTrade: () => void;
   onCancelTrade: () => void;
   checkPlayerOnline: (nickname: string) => boolean;
   waitingForResponse: boolean;
   onlinePlayers?: OnlinePlayer[];
 }
 
 export function TradeView({
   inventory,
   nickname,
   partnerNickname,
   isTrading,
   myOffers,
   theirOffers,
   tradeAccepted,
   partnerAccepted,
   onInitiateTrade,
   onAddItem,
   onRemoveItem,
   onAcceptTrade,
   onDeclineTrade,
   onCancelTrade,
   checkPlayerOnline,
   waitingForResponse,
   onlinePlayers = [],
 }: TradeViewProps) {
   const [searchNickname, setSearchNickname] = useState("");
   const [error, setError] = useState<string | null>(null);
   const [isSearching, setIsSearching] = useState(false);
 
   const handleInitiateTrade = async () => {
     if (!searchNickname.trim()) return;
     
     setError(null);
     setIsSearching(true);
 
     // Check if player is online first
     if (!checkPlayerOnline(searchNickname.trim())) {
       setError("Player isn't online");
       setIsSearching(false);
       return;
     }
 
     const result = await onInitiateTrade(searchNickname.trim());
     setIsSearching(false);
     
     if (!result.success && result.error) {
       setError(result.error);
     }
   };
 
   const inventoryItems = Object.values(inventory);
 
   // Calculate available quantities (inventory minus what's in offer)
   const getAvailableQuantity = (itemName: string) => {
     const invItem = inventory[itemName];
     if (!invItem) return 0;
     const offered = myOffers.find((o) => o.item_name === itemName);
     return invItem.count - (offered?.quantity || 0);
   };
 
   if (!isTrading && !waitingForResponse) {
     // Show nickname search view
     return (
       <div className="h-full overflow-y-auto p-4">
         <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-md mx-auto mt-12"
         >
           <div className="text-center mb-8">
             <div className="inline-flex p-4 rounded-full bg-primary/20 mb-4">
               <ArrowLeftRight className="w-12 h-12 text-primary" />
             </div>
             <h2 className="text-2xl font-bold text-foreground mb-2">Start a Trade</h2>
             <p className="text-muted-foreground">Enter a player's nickname to request a trade</p>
           </div>
 
           <div className="space-y-4">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
               <Input
                 value={searchNickname}
                 onChange={(e) => {
                   setSearchNickname(e.target.value);
                   setError(null);
                 }}
                 onKeyDown={(e) => e.key === "Enter" && handleInitiateTrade()}
                 placeholder="Enter nickname..."
                 className="pl-10 h-12 text-lg bg-black/30 border-foreground/20"
               />
             </div>
 
             <AnimatePresence>
               {error && (
                 <motion.div
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-lg p-3"
                 >
                   <AlertCircle className="w-5 h-5" />
                   <span>{error}</span>
                 </motion.div>
               )}
             </AnimatePresence>
 
             <Button
               onClick={handleInitiateTrade}
               disabled={!searchNickname.trim() || isSearching}
               className="w-full h-12 text-lg gradient-button"
             >
               {isSearching ? "Searching..." : "Request Trade"}
             </Button>

             {/* Online players list */}
             {onlinePlayers.length > 0 && (
               <div className="mt-2">
                 <div className="flex items-center gap-2 mb-2">
                   <Users className="w-4 h-4 text-muted-foreground" />
                   <span className="text-sm font-semibold text-muted-foreground">
                     Online Players ({onlinePlayers.length})
                   </span>
                 </div>
                 <div className="space-y-1.5 max-h-48 overflow-y-auto">
                   {onlinePlayers.map((player) => (
                     <motion.button
                       key={player.nickname}
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                       onClick={() => {
                         setSearchNickname(player.nickname);
                         setError(null);
                       }}
                       className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all
                         ${searchNickname === player.nickname
                           ? "bg-primary/20 border border-primary/40"
                           : "bg-black/30 border border-white/10 hover:bg-black/20 hover:border-white/20"
                         }`}
                     >
                       <Circle className="w-2.5 h-2.5 fill-green-500 text-green-500 flex-shrink-0" />
                       <span className="font-semibold text-sm text-foreground">{player.nickname}</span>
                     </motion.button>
                   ))}
                 </div>
               </div>
             )}
           </div>
         </motion.div>
       </div>
     );
   }
 
   if (waitingForResponse) {
     // Show waiting for response view
     return (
       <div className="h-full flex items-center justify-center p-4">
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="text-center"
         >
           <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
           <h2 className="text-xl font-bold text-foreground mb-2">Waiting for response...</h2>
           <p className="text-muted-foreground mb-4">
             Waiting for <span className="font-bold text-foreground">{partnerNickname}</span> to accept
           </p>
           <Button variant="outline" onClick={onCancelTrade}>
             Cancel Request
           </Button>
         </motion.div>
       </div>
     );
   }
 
   // Show trading view
   return (
     <div className="h-full flex flex-col overflow-hidden">
       {/* Header */}
       <div className="p-4 border-b border-foreground/10">
         <div className="flex items-center justify-between">
           <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
             <ArrowLeftRight className="w-5 h-5" />
             Trading with {partnerNickname}
           </h2>
           <Button variant="outline" size="sm" onClick={onCancelTrade}>
             Cancel Trade
           </Button>
         </div>
       </div>

       {/* Trade Offers - Sticky at top */}
       <div className="sticky top-0 z-10 border-b border-foreground/10 p-4 bg-black/80 backdrop-blur-sm">
         <div className="grid grid-cols-2 gap-4">
           {/* Your Offer */}
           <div>
             <h4 className="font-bold text-foreground mb-2 flex items-center gap-2 text-sm">
               Your Offer
               {tradeAccepted && <Check className="w-4 h-4 text-green-500" />}
             </h4>
             <div className="min-h-[60px] bg-black/20 rounded-lg p-2 flex flex-wrap gap-1">
               {myOffers.length === 0 ? (
                 <p className="text-muted-foreground text-xs w-full text-center py-3">Click items below</p>
               ) : (
                 myOffers.map((offer) => (
                   <motion.button
                     key={offer.id}
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     whileHover={{ scale: 1.05 }}
                     onClick={() => onRemoveItem(offer.item_name)}
                     className={`${rarityColors[offer.item_rarity as keyof typeof rarityColors]}
                       bg-black/40 rounded-lg px-2 py-0.5 text-xs font-medium flex items-center gap-1`}
                   >
                     {offer.item_name}
                     <span className="bg-black/40 rounded px-1">×{offer.quantity}</span>
                   </motion.button>
                 ))
               )}
             </div>
           </div>

           {/* Their Offer */}
           <div>
             <h4 className="font-bold text-foreground mb-2 flex items-center gap-2 text-sm">
               {partnerNickname}'s Offer
               {partnerAccepted && <Check className="w-4 h-4 text-green-500" />}
             </h4>
             <div className="min-h-[60px] bg-black/20 rounded-lg p-2 flex flex-wrap gap-1">
               {theirOffers.length === 0 ? (
                 <p className="text-muted-foreground text-xs w-full text-center py-3">Waiting for items...</p>
               ) : (
                 theirOffers.map((offer) => (
                   <motion.div
                     key={offer.id}
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     className={`${rarityColors[offer.item_rarity as keyof typeof rarityColors]}
                       bg-black/40 rounded-lg px-2 py-0.5 text-xs font-medium flex items-center gap-1`}
                   >
                     {offer.item_name}
                     <span className="bg-black/40 rounded px-1">×{offer.quantity}</span>
                   </motion.div>
                 ))
               )}
             </div>
           </div>
         </div>

         {/* Accept/Decline Buttons */}
         <div className="flex gap-3 justify-center mt-3">
           <Button
             onClick={onAcceptTrade}
             disabled={tradeAccepted}
             size="sm"
             className="bg-green-600 hover:bg-green-500 text-white px-6"
           >
             <Check className="w-4 h-4 mr-1" />
             {tradeAccepted ? "Accepted" : "Accept"}
           </Button>
           <Button
             onClick={onDeclineTrade}
             variant="destructive"
             size="sm"
             className="px-6"
           >
             <X className="w-4 h-4 mr-1" />
             Decline
           </Button>
         </div>
       </div>

       {/* Inventory Grid */}
       <div className="flex-1 overflow-y-auto p-4">
         <h3 className="text-lg font-bold mb-3 text-foreground">Your Inventory</h3>
         <p className="text-sm text-muted-foreground mb-4">Click items to add to your offer</p>

         {inventoryItems.length === 0 ? (
           <p className="text-muted-foreground text-center py-8">No items to trade</p>
         ) : (
           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
             {inventoryItems.map((item) => {
               const available = getAvailableQuantity(item.name);
               const colorClass = rarityColors[item.rarity];
               const glowClass = rarityGlowColors[item.rarity];

               return (
                 <motion.button
                   key={item.name}
                   whileHover={{ scale: available > 0 ? 1.02 : 1 }}
                   whileTap={{ scale: available > 0 ? 0.98 : 1 }}
                   onClick={() => available > 0 && onAddItem(item)}
                   disabled={available === 0}
                   className={`gradient-card rounded-xl p-3 text-left transition-all ${glowClass}
                     ${available > 0 ? "cursor-pointer hover:ring-2 ring-primary/50" : "opacity-50 cursor-not-allowed"}`}
                   style={{
                     borderColor: `hsl(var(--rarity-${item.rarity.toLowerCase().replace(" ", "-")}))`
                   }}
                 >
                   <h4 className={`font-bold text-sm ${colorClass} truncate`}>{item.name}</h4>
                   <p className={`text-xs ${colorClass} opacity-70`}>{item.rarity}</p>
                   <div className="mt-1 text-xs text-muted-foreground">
                     Available: {available}
                   </div>
                 </motion.button>
               );
             })}
           </div>
         )}
       </div>
     </div>
   );
 }