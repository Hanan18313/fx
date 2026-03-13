import { create } from "zustand";
import { loginApi, getProfileApi, logoutApi } from "../api/auth";

interface AdminInfo {
  id: number;
  username: string;
  realName: string;
  avatar: string;
  deptId: number;
}

interface AuthState {
  token: string | null;
  adminInfo: AdminInfo | null;
  permissions: string[];
  menus: any[];
  login: (username: string, password: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (code: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem("admin_token"),
  adminInfo: null,
  permissions: [],
  menus: [],

  login: async (username: string, password: string) => {
    const res: any = await loginApi({ username, password });
    const token = res.token;
    localStorage.setItem("admin_token", token);
    set({ token });
    await get().fetchProfile();
  },

  fetchProfile: async () => {
    const res: any = await getProfileApi();
    set({
      adminInfo: {
        id: res.id,
        username: res.username,
        realName: res.realName,
        avatar: res.avatar,
        deptId: res.deptId,
      },
      permissions: res.permissions || [],
      menus: res.menus || [],
    });
  },

  logout: async () => {
    const { adminInfo } = get();
    console.log("Attempting to logout admin:", adminInfo);
    if (adminInfo) {
      const res = await logoutApi({
        id: adminInfo.id,
        username: adminInfo.username,
      });
      console.log("Logout response:", res);
    }
    localStorage.removeItem("admin_token");
    set({ token: null, adminInfo: null, permissions: [], menus: [] });
  },

  hasPermission: (code: string) => {
    return get().permissions.includes(code);
  },
}));
