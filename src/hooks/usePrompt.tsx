// hooks/usePrompt.tsx
import { useContext, useEffect } from "react";
import { UNSAFE_NavigationContext } from "react-router-dom";

// react-router-dom 내부 타입 흉내내기
interface NavigatorWithBlock {
  push: (...args: unknown[]) => void;
  replace: (...args: unknown[]) => void;
}

export function usePrompt(message: string, when = true) {
  const navigationContext = useContext(UNSAFE_NavigationContext);
  const navigator = navigationContext.navigator as NavigatorWithBlock;

  useEffect(() => {
    if (!when) return;

    const originalPush = navigator.push;
    const originalReplace = navigator.replace;

    const blocker = (tx: { retry: () => void }) => {
      if (window.confirm(message)) {
        tx.retry();
      }
    };

    navigator.push = (...args: unknown[]) => {
      blocker({
        retry: () => originalPush.apply(navigator, args),
      });
    };

    navigator.replace = (...args: unknown[]) => {
      blocker({
        retry: () => originalReplace.apply(navigator, args),
      });
    };

    return () => {
      navigator.push = originalPush;
      navigator.replace = originalReplace;
    };
  }, [navigator, message, when]);
}
