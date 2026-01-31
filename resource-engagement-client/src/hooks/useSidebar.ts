import { useAppDispatch, useAppSelector, type RootState } from "../store/store";
import {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  setSidebarOpen,
} from "../store/sideNav/sidebarSlice";

export const useSidebar = () => {
  const isOpen = useAppSelector((state: RootState) => state.sidebar.isOpen);
  const dispatch = useAppDispatch();

  const toggle = () => {
    dispatch(toggleSidebar());
  };

  const open = () => {
    dispatch(openSidebar());
  };

  const close = () => {
    dispatch(closeSidebar());
  };

  const setOpen = (open: boolean) => {
    dispatch(setSidebarOpen(open));
  };

  return {
    isOpen,
    toggle,
    open,
    close,
    setOpen,
  };
};
