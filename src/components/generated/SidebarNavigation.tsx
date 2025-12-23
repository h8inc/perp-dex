import React, { useMemo, useState } from 'react';
import { BarChart2, CandlestickChart, ChevronLeft, TrendingUp, Wallet, Vault, DollarSign, Trophy, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
type NavItemProps = {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  className?: string;
  badge?: string;
};
const NavItem = ({
  icon: Icon,
  label,
  isActive,
  isCollapsed,
  onClick,
  className,
  badge
}: NavItemProps) => {
  return <div className="relative group h-10 w-full px-2">
      <button type="button" onClick={onClick} className={cn("flex items-center w-full h-10 px-3 rounded-xl transition-all duration-200 outline-none border-none cursor-pointer", isActive ? "bg-[#003022] text-white" : "text-[#9497a9] hover:bg-[#ffffff0a] hover:text-white", className)}>
        <div className="flex items-center justify-start min-w-[20px]">
          <Icon size={20} className={cn("flex-shrink-0", isActive ? "text-white" : "text-inherit")} />
        </div>
        
        <AnimatePresence initial={false}>
          {!isCollapsed && <motion.span initial={{
          opacity: 0,
          x: -10
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -10
        }} transition={{
          duration: 0.15,
          ease: "easeOut"
        }} className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden flex items-center gap-2 flex-1">
              {label}
              {badge && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ffffff1a] text-[#9497a9] font-normal">
                  {badge}
                </span>}
            </motion.span>}
        </AnimatePresence>
      </button>
    </div>;
};
const Divider = ({
  className
}: {
  className?: string;
}) => <div className={cn("px-4 py-1", className)}>
    <div className="h-[1px] w-full bg-[#686b8233]" />
  </div>;
type SidebarNavigationItemId = 'trade' | 'markets' | 'portfolio' | 'vault' | 'funding' | 'points' | 'leaderboard' | 'api';
type SidebarNavigationProps = {
  activeItemId?: SidebarNavigationItemId; // controlled
  onNavigate?: (id: SidebarNavigationItemId) => void;
  defaultCollapsed?: boolean;
  footerActions?: React.ReactNode | ((isCollapsed: boolean) => React.ReactNode);
  className?: string;
};
export const SidebarNavigation = ({
  activeItemId,
  onNavigate,
  defaultCollapsed = false,
  footerActions,
  className
}: SidebarNavigationProps) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [internalActiveId, setInternalActiveId] = useState<SidebarNavigationItemId>('portfolio');
  const resolvedActiveId = activeItemId ?? internalActiveId;
  const resolvedFooterActions = typeof footerActions === 'function' ? footerActions(isCollapsed) : footerActions;

  const navigationItems = useMemo(() => [{
    id: 'trade',
    label: 'Trade',
    icon: CandlestickChart
  }, {
    id: 'markets',
    label: 'Markets',
    icon: TrendingUp
  }, {
    id: 'portfolio',
    label: 'Portfolio',
    icon: Wallet
  }, {
    id: 'vault',
    label: 'Vault',
    icon: Vault
  }, {
    id: 'funding',
    label: 'Funding',
    icon: DollarSign
  }, {
    id: 'points',
    label: 'Points',
    icon: Trophy,
    badge: 'coming soon'
  }, {
    id: 'leaderboard',
    label: 'Leaderboard',
    icon: BarChart2
  }, {
    id: 'api',
    label: 'API',
    icon: Code
  }] as {
    id: SidebarNavigationItemId;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[], []);

  const handleClick = (itemId: SidebarNavigationItemId) => {
    setInternalActiveId(itemId);
    onNavigate?.(itemId);
  };
  return <motion.div initial={false} animate={{
    width: isCollapsed ? '64px' : '192px'
  }} transition={{
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1]
  }} className={cn("flex flex-col h-full bg-[#0a0a0a] border-r border-[#686b8233] py-2 select-none overflow-hidden", className)}>
      {/* Logo Area */}
      <div className="px-5 pt-1 pb-4 h-10 flex items-center justify-start">
        <AnimatePresence initial={false}>
          {!isCollapsed ? <motion.div key="extended-logo" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 0.15
        }} className="h-[18px] w-auto cursor-pointer flex items-center justify-start">
              <svg width="107" height="18" viewBox="0 0 107 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M81.6531 15.7371V0L79.622 0.337983V6.50215C79.152 5.95494 78.5952 5.52682 77.9514 5.22103C77.3076 4.91524 76.5962 4.76073 75.8237 4.76073C74.8419 4.76073 73.9278 5.0118 73.0909 5.51073C72.2507 6.00966 71.5876 6.68884 71.0952 7.54185C70.6027 8.39485 70.358 9.33798 70.358 10.3712C70.358 11.4045 70.6027 12.3509 71.0952 13.2135C71.5876 14.0762 72.2507 14.7521 73.0909 15.2446C73.9278 15.7371 74.8387 15.9818 75.8237 15.9818C76.6155 15.9818 77.3366 15.824 77.99 15.5086C78.6434 15.1931 79.2035 14.7521 79.6703 14.1888V15.7371H81.6531ZM79.2679 12.28C78.9364 12.8594 78.4889 13.3197 77.9256 13.6577C77.3591 13.9957 76.7411 14.1663 76.0619 14.1663C75.3827 14.1663 74.7615 13.9957 74.1982 13.6577C73.6349 13.3197 73.1907 12.8594 72.8688 12.28C72.5469 11.6974 72.3859 11.0601 72.3859 10.368C72.3859 9.67597 72.5469 9.04185 72.8688 8.46888C73.1907 7.89592 73.6349 7.43884 74.1982 7.10086C74.7647 6.76288 75.3827 6.59228 76.0619 6.59228C76.7411 6.59228 77.3623 6.76288 77.9256 7.10086C78.4889 7.44206 78.9364 7.89592 79.2679 8.46888C79.5994 9.04185 79.7636 9.67275 79.7636 10.368C79.7636 11.0633 79.5994 11.7006 79.2679 12.28Z" fill="white" />
                <path d="M43.1142 12.4473V6.81751H46.156V5.02781H43.1077V1.59326L41.0766 2.72953V5.02781H39.7955L39.4575 6.81751H41.0798V12.6244C41.0798 13.6544 41.3695 14.4656 41.9522 15.0546C42.5348 15.6437 43.3234 15.9366 44.3245 15.9366C44.6785 15.9366 45.0198 15.9012 45.3416 15.8272C45.6635 15.7531 45.9371 15.6694 46.1625 15.5729V13.7574C45.9532 13.854 45.7086 13.9345 45.4253 13.9988C45.1453 14.0632 44.8813 14.0954 44.6399 14.0954C44.1539 14.0954 43.7805 13.9538 43.5133 13.6705C43.2461 13.3873 43.1142 12.9785 43.1142 12.4473Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M27.9693 14.0441L27.2451 12.3026V12.3059C26.067 13.5966 24.7279 14.2404 23.2279 14.2404C22.4232 14.2404 21.7118 14.0473 21.1002 13.661C20.4854 13.2747 20.0348 12.7501 19.7451 12.0902L28.2622 9.3316C28.1496 8.411 27.8567 7.60628 27.3803 6.911C26.9039 6.21894 26.2987 5.68461 25.5648 5.31444C24.8309 4.94426 24.0197 4.75757 23.1346 4.75757C22.0852 4.75757 21.1292 5.00864 20.2665 5.50757C19.4039 6.0065 18.7215 6.68568 18.2225 7.53868C17.7236 8.39491 17.4725 9.36057 17.4725 10.3938C17.4725 11.4271 17.7172 12.3734 18.2097 13.2361C18.7021 14.0988 19.3878 14.7747 20.2665 15.2672C21.1453 15.7597 22.1238 16.0044 23.2054 16.0044C24.0906 16.0044 24.9371 15.8337 25.7451 15.4958C26.5498 15.1578 27.2934 14.6717 27.9693 14.0441ZM19.8803 8.43353C20.2118 7.83482 20.6624 7.36486 21.2354 7.01722H21.2322C21.8052 6.66959 22.4393 6.49577 23.1313 6.49577C23.7944 6.49577 24.3835 6.65349 24.8985 6.96894C25.4167 7.28439 25.7869 7.71572 26.0122 8.26293L19.3846 10.4164C19.3846 9.69212 19.5487 9.02903 19.8803 8.43353Z" fill="white" />
                <path d="M33.8017 11.5269L36.6794 15.7372H39.0807L35.041 10.1235L38.7169 5.01831H36.3704L33.8049 8.74256L31.2652 5.01831H28.8929L32.5946 10.1235L28.5292 15.7372H30.924L33.8017 11.5269Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M57.46 14.0441L56.7358 12.3026V12.3059C55.5577 13.5966 54.2186 14.2404 52.7186 14.2404C51.9139 14.2404 51.2025 14.0473 50.5909 13.661C49.9761 13.2747 49.5255 12.7501 49.2358 12.0902L57.753 9.3316C57.6403 8.411 57.3474 7.60628 56.871 6.911C56.3946 6.21894 55.7894 5.68461 55.0555 5.31444C54.3216 4.94426 53.5105 4.75757 52.6253 4.75757C51.5759 4.75757 50.6199 5.00864 49.7573 5.50757C48.8946 6.0065 48.2122 6.68568 47.7133 7.53868C47.2143 8.39491 46.9633 9.36057 46.9633 10.3938C46.9633 11.4271 47.2079 12.3734 47.7004 13.2361C48.1929 14.0988 48.8785 14.7747 49.7573 15.2672C50.636 15.7597 51.6145 16.0044 52.6961 16.0044C53.5813 16.0044 54.4279 15.8337 55.2358 15.4958C56.0405 15.1578 56.7841 14.6717 57.46 14.0441ZM49.3678 8.43353C49.6993 7.83482 50.15 7.36486 50.7229 7.01722H50.7197C51.2927 6.66959 51.9268 6.49577 52.6188 6.49577C53.2819 6.49577 53.871 6.65349 54.386 6.96894C54.9042 7.28439 55.2744 7.71572 55.4997 8.26293L48.8721 10.4164C48.8721 9.69212 49.0362 9.02903 49.3678 8.43353Z" fill="white" />
                <path d="M66.7988 5.28873C67.4265 5.64281 67.919 6.16427 68.2731 6.84989C68.6272 7.53551 68.8042 8.33701 68.8042 9.25761V15.7404H66.7731V9.45075C66.7731 8.54624 66.5381 7.84774 66.0714 7.3456C65.6046 6.84667 64.9737 6.5956 64.1851 6.5956C63.6379 6.5956 63.1454 6.72113 62.7108 6.97221C62.2763 7.22328 61.9351 7.58057 61.6937 8.04731C61.4523 8.51405 61.3299 9.05482 61.3299 9.66963V15.7404H59.2988V5.16641L61.2334 4.85096V6.27693C61.6357 5.79409 62.1282 5.41748 62.7076 5.15354C63.287 4.88637 63.9244 4.75439 64.6196 4.75439C65.4437 4.75439 66.1679 4.93143 66.7956 5.28551L66.7988 5.28873Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M92.8034 12.3026L93.5277 14.0441C92.8517 14.6717 92.1081 15.1578 91.3034 15.4958C90.4955 15.8337 89.6489 16.0044 88.7637 16.0044C87.6822 16.0044 86.7036 15.7597 85.8249 15.2672C84.9461 14.7747 84.2605 14.0988 83.768 13.2361C83.2755 12.3734 83.0309 11.4271 83.0309 10.3938C83.0309 9.36057 83.282 8.39491 83.7809 7.53868C84.2798 6.68568 84.9622 6.0065 85.8249 5.50757C86.6875 5.00864 87.6435 4.75757 88.6929 4.75757C89.5781 4.75757 90.3893 4.94426 91.1232 5.31444C91.8571 5.68461 92.4622 6.21894 92.9386 6.911C93.415 7.60628 93.7079 8.411 93.8206 9.3316L85.3034 12.0902C85.5931 12.7501 86.0438 13.2747 86.6586 13.661C87.2701 14.0473 87.9815 14.2404 88.7862 14.2404C90.2862 14.2404 91.6253 13.5966 92.8034 12.3059V12.3026ZM86.7938 7.01722C86.2208 7.36486 85.7701 7.83482 85.4386 8.43353C85.1071 9.02903 84.9429 9.69212 84.9429 10.4164L91.5706 8.26293C91.3453 7.71572 90.9751 7.28439 90.4568 6.96894C89.9418 6.65349 89.3528 6.49577 88.6897 6.49577C87.9976 6.49577 87.3635 6.66959 86.7905 7.01722H86.7938Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M106.133 15.7371V0L104.102 0.337983V6.50215C103.632 5.95494 103.075 5.52682 102.432 5.22103C101.788 4.91524 101.076 4.76073 100.304 4.76073C99.3222 4.76073 98.408 5.0118 97.5711 5.51073C96.731 6.00966 96.0679 6.68884 95.5754 7.54185C95.0829 8.39485 94.8383 9.33798 94.8383 10.3712C94.8383 11.4045 95.0829 12.3509 95.5754 13.2135C96.0679 14.0762 96.731 14.7521 97.5711 15.2446C98.408 15.7371 99.3189 15.9818 100.304 15.9818C101.096 15.9818 101.817 15.824 102.47 15.5086C103.124 15.1931 103.684 14.7521 104.15 14.1888V15.7371H106.133ZM103.751 12.28C103.42 12.8594 102.972 13.3197 102.409 13.6577C101.843 13.9957 101.225 14.1663 100.545 14.1663C99.8661 14.1663 99.2449 13.9957 98.6816 13.6577C98.1183 13.3197 97.6741 12.8594 97.3522 12.28C97.0303 11.6974 96.8694 11.0601 96.8694 10.368C96.8694 9.67597 97.0303 9.04185 97.3522 8.46888C97.6741 7.89592 98.1183 7.43884 98.6816 7.10086C99.2481 6.76288 99.8661 6.59228 100.545 6.59228C101.225 6.59228 101.846 6.76288 102.409 7.10086C102.972 7.44206 103.42 7.89592 103.751 8.46888C104.083 9.04185 104.247 9.67275 104.247 10.368C104.247 11.0633 104.083 11.7006 103.751 12.28Z" fill="white" />
                <path d="M7.61588 5.40458C4.74142 5.40458 2.09871 4.4196 0 2.76831C1.64807 4.86702 2.63627 7.50973 2.63627 10.3842C2.63627 13.2587 1.64807 15.9014 0 18.0001C2.09871 16.352 4.74142 15.3638 7.61588 15.3638C10.4903 15.3638 13.133 16.3488 15.2318 18.0001C13.5837 15.9014 12.5955 13.2587 12.5955 10.3842C12.5955 7.50973 13.5805 4.86702 15.2318 2.76831C13.1363 4.41638 10.4903 5.40458 7.61588 5.40458Z" fill="#00BC84" />
              </svg>
            </motion.div> : <motion.div key="icon-logo" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 0.15
        }} className="text-white cursor-pointer flex items-center justify-center w-full">
              <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.61588 5.40458C4.74142 5.40458 2.09871 4.4196 0 2.76831C1.64807 4.86702 2.63627 7.50973 2.63627 10.3842C2.63627 13.2587 1.64807 15.9014 0 18.0001C2.09871 16.352 4.74142 15.3638 7.61588 15.3638C10.4903 15.3638 13.133 16.3488 15.2318 18.0001C13.5837 15.9014 12.5955 13.2587 12.5955 10.3842C12.5955 7.50973 13.5805 4.86702 15.2318 2.76831C13.1363 4.41638 10.4903 5.40458 7.61588 5.40458Z" fill="#00BC84" />
              </svg>
            </motion.div>}
        </AnimatePresence>
      </div>

      {/* Main Navigation */}
      <div className="flex-grow flex flex-col gap-1 overflow-y-auto overflow-x-hidden scrollbar-none py-2">
        {navigationItems.map(item => <NavItem key={item.id} icon={item.icon} label={item.label} isActive={resolvedActiveId === item.id} isCollapsed={isCollapsed} onClick={() => handleClick(item.id)} badge={item.badge} />)}
      </div>

      {/* Footer / Collapse Button */}
      <div className="mt-auto border-t border-[#686b8233] pt-2">
        {resolvedFooterActions && <div className={cn("px-2 pb-2", isCollapsed ? "flex flex-col items-center gap-1" : "flex flex-col gap-1")}>
            {resolvedFooterActions}
          </div>}
        <NavItem icon={ChevronLeft} label="Collapse" isCollapsed={isCollapsed} onClick={() => setIsCollapsed(!isCollapsed)} className="text-[#9497a9]" />
      </div>
    </motion.div>;
};