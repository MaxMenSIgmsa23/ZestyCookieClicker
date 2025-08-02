@@ .. @@
 export interface CookieType {
   id: string;
   name: string;
   description: string;
-  emoji: string;
+  imageUrl: string;
   unlockCost: number;
   clickMultiplier: number;
   passiveMultiplier: number;
   color: string;
   glowColor: string;
   unlockRequirement: number;
+  hueRotate?: number;
+  saturation?: number;
+  brightness?: number;
 }
 
 export interface Upgrade {
@@ .. @@
   effect: number;
   maxLevel?: number;
   type: 'click' | 'passive' | 'special';
-  icon: string;
+  icon: string; // Now image URL
 }
 
 export interface Generator {
@@ .. @@
   baseCost: number;
   costMultiplier: number;
   cookiesPerSecond: number;
-  icon: string;
+  icon: string; // Now image URL
 }
 
 export interface Achievement {
@@ .. @@
   requirement: number;
   type: 'clicks' | 'cookies' | 'upgrades' | 'generators' | 'prestige' | 'promo';
   reward: number;
-  icon: string;
+  icon: string; // Now image URL
 }
 
 export interface Buff {
@@ .. @@
   multiplier: number;
   duration: number;
   startTime: number;
-  icon: string;
+  icon: string; // Now image URL
 }