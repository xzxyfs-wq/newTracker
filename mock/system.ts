import { defineFakeRoute } from "vite-plugin-fake-server/client";
import { faker } from "@faker-js/faker/locale/zh_CN";

export default defineFakeRoute([
  // 用户管理
  {
    url: "/user",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          avatar: "https://avatars.githubusercontent.com/u/44761321",
          username: "admin",
          nickname: "小铭",
          phone: "15888886789",
          email: faker.internet.email(),
          sex: 0,
          id: 1,
          status: 1,
          dept: {
            // 部门id
            id: 103,
            // 部门名称
            name: "研发部门"
          },
          remark: "管理员",
          createTime: 1605456000000
        },
        {
          avatar: "https://avatars.githubusercontent.com/u/52823142",
          username: "common",
          nickname: "小林",
          phone: "18288882345",
          email: faker.internet.email(),
          sex: 1,
          id: 2,
          status: 1,
          dept: {
            id: 105,
            name: "测试部门"
          },
          remark: "普通用户",
          createTime: 1605456000000
        }
      ];
      list = list.filter(item => item.username.includes(body?.username));
      list = list.filter(item =>
        String(item.status).includes(String(body?.status))
      );
      if (body.phone) list = list.filter(item => item.phone === body.phone);
      if (body.deptId) list = list.filter(item => item.dept.id === body.deptId);
      return {
        success: true,
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  },
  // 用户管理-获取所有角色列表
  {
    url: "/list-all-role",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [
          { id: 1, name: "超级管理员" },
          { id: 2, name: "普通角色" }
        ]
      };
    }
  },
  // 用户管理-根据 userId 获取对应角色 id 列表（userId：用户id）
  {
    url: "/list-role-ids",
    method: "post",
    response: ({ body }) => {
      if (body.userId) {
        if (body.userId == 1) {
          return {
            success: true,
            data: [1]
          };
        } else if (body.userId == 2) {
          return {
            success: true,
            data: [2]
          };
        }
      } else {
        return {
          success: false,
          data: []
        };
      }
    }
  },
  // 角色管理
  {
    url: "/role",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          createTime: 1605456000000, // 时间戳（毫秒ms）
          updateTime: 1684512000000,
          id: 1,
          name: "超级管理员",
          code: "admin",
          status: 1, // 状态 1 启用 0 停用
          remark: "超级管理员拥有最高权限"
        },
        {
          createTime: 1605456000000,
          updateTime: 1684512000000,
          id: 2,
          name: "普通角色",
          code: "common",
          status: 1,
          remark: "普通角色拥有部分权限"
        }
      ];
      list = list.filter(item => item.name.includes(body?.name));
      list = list.filter(item =>
        String(item.status).includes(String(body?.status))
      );
      if (body.code) list = list.filter(item => item.code === body.code);
      return {
        success: true,
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  },
  // 角色管理-权限-菜单权限
  {
    url: "/role-menu",
    method: "post",
    response: () => {
      return {
        success: true,
        data: [
          // 外部页面
          {
            parentId: 0,
            id: 100,
            menuType: 0, // 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）
            title: "menus.pureExternalPage"
          },
          {
            parentId: 100,
            id: 101,
            menuType: 0,
            title: "menus.pureExternalDoc"
          },
          {
            parentId: 101,
            id: 102,
            menuType: 2,
            title: "menus.pureExternalLink"
          },
          {
            parentId: 101,
            id: 103,
            menuType: 2,
            title: "menus.pureUtilsLink"
          },
          {
            parentId: 100,
            id: 104,
            menuType: 1,
            title: "menus.pureEmbeddedDoc"
          },
          {
            parentId: 104,
            id: 105,
            menuType: 1,
            title: "menus.pureEpDoc"
          },
          {
            parentId: 104,
            id: 106,
            menuType: 1,
            title: "menus.pureTailwindcssDoc"
          },
          {
            parentId: 104,
            id: 107,
            menuType: 1,
            title: "menus.pureVueDoc"
          },
          {
            parentId: 104,
            id: 108,
            menuType: 1,
            title: "menus.pureViteDoc"
          },
          {
            parentId: 104,
            id: 109,
            menuType: 1,
            title: "menus.purePiniaDoc"
          },
          {
            parentId: 104,
            id: 110,
            menuType: 1,
            title: "menus.pureRouterDoc"
          },
          // 权限管理
          {
            parentId: 0,
            id: 200,
            menuType: 0,
            title: "menus.purePermission"
          },
          {
            parentId: 200,
            id: 201,
            menuType: 0,
            title: "menus.purePermissionPage"
          },
          {
            parentId: 200,
            id: 202,
            menuType: 0,
            title: "menus.purePermissionButton"
          },
          {
            parentId: 202,
            id: 203,
            menuType: 3,
            title: "添加"
          },
          {
            parentId: 202,
            id: 204,
            menuType: 3,
            title: "修改"
          },
          {
            parentId: 202,
            id: 205,
            menuType: 3,
            title: "删除"
          },
          // 系统管理
          {
            parentId: 0,
            id: 300,
            menuType: 0,
            title: "menus.pureSysManagement"
          },
          {
            parentId: 300,
            id: 301,
            menuType: 0,
            title: "menus.pureUser"
          },
          {
            parentId: 300,
            id: 302,
            menuType: 0,
            title: "menus.pureRole"
          },
          {
            parentId: 300,
            id: 303,
            menuType: 0,
            title: "menus.pureSystemMenu"
          },
          {
            parentId: 300,
            id: 304,
            menuType: 0,
            title: "menus.pureDept"
          },
          // 系统监控
          {
            parentId: 0,
            id: 400,
            menuType: 0,
            title: "menus.pureSysMonitor"
          },
          {
            parentId: 400,
            id: 401,
            menuType: 0,
            title: "menus.pureOnlineUser"
          },
          {
            parentId: 400,
            id: 402,
            menuType: 0,
            title: "menus.pureLoginLog"
          },
          {
            parentId: 400,
            id: 403,
            menuType: 0,
            title: "menus.pureOperationLog"
          },
          {
            parentId: 400,
            id: 404,
            menuType: 0,
            title: "menus.pureSystemLog"
          },
          // 标签页操作
          {
            parentId: 0,
            id: 500,
            menuType: 0,
            title: "menus.pureTabs"
          },
          {
            parentId: 500,
            id: 501,
            menuType: 0,
            title: "menus.pureTabs"
          },
          {
            parentId: 500,
            id: 502,
            menuType: 0,
            title: "query传参模式"
          },
          {
            parentId: 500,
            id: 503,
            menuType: 0,
            title: "params传参模式"
          }
        ]
      };
    }
  },
  // 角色管理-权限-菜单权限-根据角色 id 查对应菜单
  {
    url: "/role-menu-ids",
    method: "post",
    response: ({ body }) => {
      if (body.id == 1) {
        return {
          success: true,
          data: [
            100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 200, 201,
            202, 203, 204, 205, 300, 301, 302, 303, 304, 400, 401, 402, 403,
            404, 500, 501, 502, 503
          ]
        };
      } else if (body.id == 2) {
        return {
          success: true,
          data: [
            100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 404, 500,
            501, 502, 503
          ]
        };
      }
    }
  },
  // 菜单管理
  {
    url: "/menu",
    method: "post",
    response: () => {
      return {
        success: true,
        data: [
          // 外部页面
          {
            parentId: 0,
            id: 100,
            menuType: 0, // 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）
            title: "menus.pureExternalPage",
            name: "PureIframe",
            path: "/iframe",
            component: "",
            rank: 7,
            redirect: "",
            icon: "ri:links-fill",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 100,
            id: 101,
            menuType: 0,
            title: "menus.pureExternalDoc",
            name: "PureIframeExternal",
            path: "/iframe/external",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 101,
            id: 102,
            menuType: 2,
            title: "menus.pureExternalLink",
            name: "https://pure-admin.cn/",
            path: "/external",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 101,
            id: 103,
            menuType: 2,
            title: "menus.pureUtilsLink",
            name: "https://pure-admin-utils.netlify.app/",
            path: "/pureUtilsLink",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 100,
            id: 104,
            menuType: 1,
            title: "menus.pureEmbeddedDoc",
            name: "PureIframeEmbedded",
            path: "/iframe/embedded",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 105,
            menuType: 1,
            title: "menus.pureEpDoc",
            name: "FrameEp",
            path: "/iframe/ep",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://element-plus.org/zh-CN/",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 106,
            menuType: 1,
            title: "menus.pureTailwindcssDoc",
            name: "FrameTailwindcss",
            path: "/iframe/tailwindcss",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://tailwindcss.com/docs/installation",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 107,
            menuType: 1,
            title: "menus.pureVueDoc",
            name: "FrameVue",
            path: "/iframe/vue3",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://cn.vuejs.org/",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 108,
            menuType: 1,
            title: "menus.pureViteDoc",
            name: "FrameVite",
            path: "/iframe/vite",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://cn.vitejs.dev/",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 109,
            menuType: 1,
            title: "menus.purePiniaDoc",
            name: "FramePinia",
            path: "/iframe/pinia",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://pinia.vuejs.org/zh/index.html",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 110,
            menuType: 1,
            title: "menus.pureRouterDoc",
            name: "FrameRouter",
            path: "/iframe/vue-router",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://router.vuejs.org/zh/",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          // 权限管理
          {
            parentId: 0,
            id: 200,
            menuType: 0,
            title: "menus.purePermission",
            name: "PurePermission",
            path: "/permission",
            component: "",
            rank: 9,
            redirect: "",
            icon: "ep:lollipop",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 200,
            id: 201,
            menuType: 0,
            title: "menus.purePermissionPage",
            name: "PermissionPage",
            path: "/permission/page/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 200,
            id: 202,
            menuType: 0,
            title: "menus.purePermissionButton",
            name: "PermissionButton",
            path: "/permission/button",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 202,
            id: 203,
            menuType: 0,
            title: "menus.purePermissionButtonRouter",
            name: "PermissionButtonRouter",
            path: "/permission/button/router",
            component: "permission/button/index",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 203,
            id: 210,
            menuType: 3,
            title: "添加",
            name: "",
            path: "",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "permission:btn:add",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 203,
            id: 211,
            menuType: 3,
            title: "修改",
            name: "",
            path: "",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "permission:btn:edit",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 203,
            id: 212,
            menuType: 3,
            title: "删除",
            name: "",
            path: "",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "permission:btn:delete",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 202,
            id: 204,
            menuType: 0,
            title: "menus.purePermissionButtonLogin",
            name: "PermissionButtonLogin",
            path: "/permission/button/login",
            component: "permission/button/perms",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 204,
            id: 220,
            menuType: 3,
            title: "添加",
            name: "",
            path: "",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "permission:btn:add",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 204,
            id: 221,
            menuType: 3,
            title: "修改",
            name: "",
            path: "",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "permission:btn:edit",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 204,
            id: 222,
            menuType: 3,
            title: "删除",
            name: "",
            path: "",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "permission:btn:delete",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          // 系统管理
          {
            parentId: 0,
            id: 300,
            menuType: 0,
            title: "menus.pureSysManagement",
            name: "PureSystem",
            path: "/system",
            component: "",
            rank: 10,
            redirect: "",
            icon: "ri:settings-3-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 300,
            id: 301,
            menuType: 0,
            title: "menus.pureUser",
            name: "SystemUser",
            path: "/system/user/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "ri:admin-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 300,
            id: 302,
            menuType: 0,
            title: "menus.pureRole",
            name: "SystemRole",
            path: "/system/role/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "ri:admin-fill",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 300,
            id: 303,
            menuType: 0,
            title: "menus.pureSystemMenu",
            name: "SystemMenu",
            path: "/system/menu/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "ep:menu",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 300,
            id: 304,
            menuType: 0,
            title: "menus.pureDept",
            name: "SystemDept",
            path: "/system/dept/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "ri:git-branch-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 300,
            id: 305,
            menuType: 0,
            title: "menus.pureDict",
            name: "SystemDict",
            path: "/system/dict/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "ri:book-open-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          // 系统监控
          {
            parentId: 0,
            id: 400,
            menuType: 0,
            title: "menus.pureSysMonitor",
            name: "PureMonitor",
            path: "/monitor",
            component: "",
            rank: 11,
            redirect: "",
            icon: "ep:monitor",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 400,
            id: 401,
            menuType: 0,
            title: "menus.pureOnlineUser",
            name: "OnlineUser",
            path: "/monitor/online-user",
            component: "monitor/online/index",
            rank: null,
            redirect: "",
            icon: "ri:user-voice-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 400,
            id: 402,
            menuType: 0,
            title: "menus.pureLoginLog",
            name: "LoginLog",
            path: "/monitor/login-logs",
            component: "monitor/logs/login/index",
            rank: null,
            redirect: "",
            icon: "ri:window-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 400,
            id: 403,
            menuType: 0,
            title: "menus.pureOperationLog",
            name: "OperationLog",
            path: "/monitor/operation-logs",
            component: "monitor/logs/operation/index",
            rank: null,
            redirect: "",
            icon: "ri:history-fill",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 400,
            id: 404,
            menuType: 0,
            title: "menus.pureSystemLog",
            name: "SystemLog",
            path: "/monitor/system-logs",
            component: "monitor/logs/system/index",
            rank: null,
            redirect: "",
            icon: "ri:file-search-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          // 标签页操作
          {
            parentId: 0,
            id: 500,
            menuType: 0,
            title: "menus.pureTabs",
            name: "PureTabs",
            path: "/tabs",
            component: "",
            rank: 12,
            redirect: "",
            icon: "ri:bookmark-2-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 500,
            id: 501,
            menuType: 0,
            title: "menus.pureTabs",
            name: "Tabs",
            path: "/tabs/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 500,
            id: 502,
            menuType: 0,
            title: "query传参模式",
            name: "TabQueryDetail",
            path: "/tabs/query-detail",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "/tabs/index",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: false,
            showParent: false
          },
          {
            parentId: 500,
            id: 503,
            menuType: 0,
            title: "params传参模式",
            name: "TabParamsDetail",
            path: "/tabs/params-detail/:id",
            component: "params-detail",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "/tabs/index",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: false,
            showParent: false
          }
        ]
      };
    }
  },
  // 部门管理
  {
    url: "/dept",
    method: "post",
    response: () => {
      return {
        success: true,
        data: [
          {
            name: "杭州总公司",
            parentId: 0,
            id: 100,
            sort: 0,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1, // 状态 1 启用 0 停用
            type: 1, // 1 公司 2 分公司 3 部门
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "郑州分公司",
            parentId: 100,
            id: 101,
            sort: 1,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 2,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "研发部门",
            parentId: 101,
            id: 103,
            sort: 1,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "市场部门",
            parentId: 102,
            id: 108,
            sort: 1,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "深圳分公司",
            parentId: 100,
            id: 102,
            sort: 2,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 2,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "市场部门",
            parentId: 101,
            id: 104,
            sort: 2,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "财务部门",
            parentId: 102,
            id: 109,
            sort: 2,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "测试部门",
            parentId: 101,
            id: 105,
            sort: 3,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 0,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "财务部门",
            parentId: 101,
            id: 106,
            sort: 4,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "运维部门",
            parentId: 101,
            id: 107,
            sort: 5,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 0,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          }
        ]
      };
    }
  },
  // 在线用户
  {
    url: "/online-logs",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          id: 1,
          username: "admin",
          ip: faker.internet.ipv4(),
          address: "中国河南省信阳市",
          system: "macOS",
          browser: "Chrome",
          loginTime: new Date()
        },
        {
          id: 2,
          username: "common",
          ip: faker.internet.ipv4(),
          address: "中国广东省深圳市",
          system: "Windows",
          browser: "Firefox",
          loginTime: new Date()
        }
      ];
      list = list.filter(item => item.username.includes(body?.username));
      return {
        success: true,
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  },
  // 登录日志
  {
    url: "/login-logs",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          id: 1,
          username: "admin",
          ip: faker.internet.ipv4(),
          address: "中国河南省信阳市",
          system: "macOS",
          browser: "Chrome",
          status: 1, // 登录状态 1 成功 0 失败
          behavior: "账号登录",
          loginTime: new Date()
        },
        {
          id: 2,
          username: "common",
          ip: faker.internet.ipv4(),
          address: "中国广东省深圳市",
          system: "Windows",
          browser: "Firefox",
          status: 0,
          behavior: "第三方登录",
          loginTime: new Date()
        }
      ];
      list = list.filter(item => item.username.includes(body?.username));
      list = list.filter(item =>
        String(item.status).includes(String(body?.status))
      );
      return {
        success: true,
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  },
  // 操作日志
  {
    url: "/operation-logs",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          id: 1,
          username: "admin",
          ip: faker.internet.ipv4(),
          address: "中国河南省信阳市",
          system: "macOS",
          browser: "Chrome",
          status: 1, // 操作状态 1 成功 0 失败
          summary: "菜单管理-添加菜单", // 操作概要
          module: "系统管理", // 所属模块
          operatingTime: new Date() // 操作时间
        },
        {
          id: 2,
          username: "common",
          ip: faker.internet.ipv4(),
          address: "中国广东省深圳市",
          system: "Windows",
          browser: "Firefox",
          status: 0,
          summary: "列表分页查询",
          module: "在线用户",
          operatingTime: new Date()
        }
      ];
      list = list.filter(item => item.module.includes(body?.module));
      list = list.filter(item =>
        String(item.status).includes(String(body?.status))
      );
      return {
        success: true,
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  },
  // 系统日志
  {
    url: "/system-logs",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          id: 1, // 日志ID
          /**
           * 日志级别
           * 0 debug调试（最低级别的日志，用于调试和开发阶段）
           * 1 info信息（默认级别，用于记录一般的信息）
           * 2 warn警告（表示可能出现的问题或潜在的错误，但不会影响系统的正常运行）
           * 3 error错误（表示发生了错误，但不会导致系统崩溃）
           * 4 fatal致命（最高级别的日志，表示发生了严重错误，导致系统无法继续运行）
           */
          level: 1,
          module: "菜单管理", // 所属模块
          url: "/menu", // 请求接口
          method: "post", // 请求方法
          ip: faker.internet.ipv4(),
          address: "中国河南省信阳市",
          system: "macOS",
          browser: "Chrome",
          /**
           * 请求耗时（单位：ms 毫秒）
           * 正常耗时：一般认为在几百毫秒（0.1-0.5秒）范围内的请求耗时较为正常
           * 较慢耗时：在1秒以上的耗时可以被认为是较慢的请求，但具体是否较慢还需要根据具体业务场景和性能要求来判断
           */
          takesTime: 10,
          requestTime: new Date() // 请求时间
        },
        {
          id: 2,
          level: 0,
          module: "地图",
          url: "/get-map-info",
          method: "get",
          ip: faker.internet.ipv4(),
          address: "中国广东省深圳市",
          system: "Windows",
          browser: "Firefox",
          takesTime: 1200,
          requestTime: new Date()
        }
      ];
      list = list.filter(item => item.module.includes(body?.module));
      return {
        success: true,
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  },
  // 系统日志-根据 id 查日志详情
  {
    url: "/system-logs-detail",
    method: "post",
    response: ({ body }) => {
      if (body.id == 1) {
        return {
          id: 1,
          level: 1,
          module: "菜单管理",
          url: "/menu",
          method: "post",
          ip: faker.internet.ipv4(),
          address: "中国河南省信阳市",
          system: "macOS",
          browser: "Chrome",
          takesTime: 10,
          responseHeaders: {
            traceId: "1495502411171032",
            "Content-Type": "application/json",
            Connection: "keep-alive",
            "Keep-Alive": "timeout=5",
            "Content-Length": 17019
          },
          responseBody: {
            success: true,
            data: [
              {
                parentId: 0,
                id: 400,
                menuType: 0,
                title: "menus.pureSysMonitor",
                name: "PureMonitor",
                path: "/monitor",
                component: "",
                rank: 11,
                redirect: "",
                icon: "ep:monitor",
                extraIcon: "",
                enterTransition: "",
                leaveTransition: "",
                activePath: "",
                auths: "",
                frameSrc: "",
                frameLoading: true,
                keepAlive: false,
                hiddenTag: false,
                fixedTag: false,
                showLink: true,
                showParent: false
              },
              {
                parentId: 400,
                id: 401,
                menuType: 0,
                title: "menus.pureOnlineUser",
                name: "OnlineUser",
                path: "/monitor/online-user",
                component: "monitor/online/index",
                rank: null,
                redirect: "",
                icon: "ri:user-voice-line",
                extraIcon: "",
                enterTransition: "",
                leaveTransition: "",
                activePath: "",
                auths: "",
                frameSrc: "",
                frameLoading: true,
                keepAlive: false,
                hiddenTag: false,
                fixedTag: false,
                showLink: true,
                showParent: false
              },
              {
                parentId: 400,
                id: 402,
                menuType: 0,
                title: "menus.pureLoginLog",
                name: "LoginLog",
                path: "/monitor/login-logs",
                component: "monitor/logs/login/index",
                rank: null,
                redirect: "",
                icon: "ri:window-line",
                extraIcon: "",
                enterTransition: "",
                leaveTransition: "",
                activePath: "",
                auths: "",
                frameSrc: "",
                frameLoading: true,
                keepAlive: false,
                hiddenTag: false,
                fixedTag: false,
                showLink: true,
                showParent: false
              },
              {
                parentId: 400,
                id: 403,
                menuType: 0,
                title: "menus.pureOperationLog",
                name: "OperationLog",
                path: "/monitor/operation-logs",
                component: "monitor/logs/operation/index",
                rank: null,
                redirect: "",
                icon: "ri:history-fill",
                extraIcon: "",
                enterTransition: "",
                leaveTransition: "",
                activePath: "",
                auths: "",
                frameSrc: "",
                frameLoading: true,
                keepAlive: false,
                hiddenTag: false,
                fixedTag: false,
                showLink: true,
                showParent: false
              },
              {
                parentId: 400,
                id: 404,
                menuType: 0,
                title: "menus.pureSystemLog",
                name: "SystemLog",
                path: "/monitor/system-logs",
                component: "monitor/logs/system/index",
                rank: null,
                redirect: "",
                icon: "ri:file-search-line",
                extraIcon: "",
                enterTransition: "",
                leaveTransition: "",
                activePath: "",
                auths: "",
                frameSrc: "",
                frameLoading: true,
                keepAlive: false,
                hiddenTag: false,
                fixedTag: false,
                showLink: true,
                showParent: false
              }
            ]
          },
          requestHeaders: {
            Accept: "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,eo;q=0.7",
            Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.admin",
            Connection: "keep-alive",
            "Content-Length": 0,
            Cookie:
              "_ga=GA1.1.231800979.1704562367; _ga_M74ZHEQ1M1=GS1.1.1709299375.7.1.1709299476.0.0.0; Hm_lvt_6a7dac00248d3b6ad8479d7249bb29c5=1709032753,1709359575; Hm_lvt_23a157b7d0d9867f7a51e42628f052f5=1708960489,1709485849,1709879672; authorized-token={%22accessToken%22:%22eyJhbGciOiJIUzUxMiJ9.admin%22%2C%22expires%22:1919520000000}; multiple-tabs=true",
            Host: "192.168.2.121:8848",
            Origin: "http://192.168.2.121:8848",
            Referer: "http://192.168.2.121:8848/",
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest"
          },
          requestBody: {
            title: "系统监控"
          },
          traceId: "1495502411171032",
          requestTime: new Date()
        };
      } else if (body.id == 2) {
        return {
          id: 2,
          level: 0,
          module: "地图",
          url: "/get-map-info?plateNumber=豫A59778U",
          method: "get",
          ip: faker.internet.ipv4(),
          address: "中国广东省深圳市",
          system: "Windows",
          browser: "Firefox",
          takesTime: 1200,
          responseHeaders: {
            traceId: "2280443117103208",
            "Content-Type": "application/json",
            Connection: "keep-alive",
            "Keep-Alive": "timeout=5",
            "Content-Length": 28693
          },
          responseBody: {
            plateNumber: "豫A59778U",
            driver: "子骞",
            orientation: 289,
            lng: 113.8564,
            lat: 34.373
          },
          requestHeaders: {
            Accept: "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,eo;q=0.7",
            Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.admin",
            Connection: "keep-alive",
            "Content-Length": 0,
            Cookie:
              "_ga=GA1.1.231800979.1704562367; _ga_M74ZHEQ1M1=GS1.1.1709299375.7.1.1709299476.0.0.0; Hm_lvt_6a7dac00248d3b6ad8479d7249bb29c5=1709032753,1709359575; Hm_lvt_23a157b7d0d9867f7a51e42628f052f5=1708960489,1709485849,1709879672; authorized-token={%22accessToken%22:%22eyJhbGciOiJIUzUxMiJ9.admin%22%2C%22expires%22:1919520000000}; multiple-tabs=true",
            Host: "192.168.2.121:8848",
            Origin: "http://192.168.2.121:8848",
            Referer: "http://192.168.2.121:8848/",
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest"
          },
          requestBody: null,
          traceId: "2280443117103208",
          requestTime: new Date()
        };
      }
    }
  },
  // 院区配置列表
  {
    url: "/hospital-district",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          hospital_district_id: 1,
          hospital_district_no: "001",
          hospital_district_name: "测试院区1",
          is_use: 1,
          status: 1,
          hospital_district_ids: null,
          create_by: 1,
          created_at: "2024-06-06 15:32:21",
          update_by: 0,
          updated_at: "2025-04-27 15:50:09"
        },
        {
          hospital_district_id: 2,
          hospital_district_no: "002",
          hospital_district_name: "北京肿瘤",
          is_use: 1,
          status: -1,
          hospital_district_ids: null,
          create_by: 2,
          created_at: "2024-07-17 14:22:49",
          update_by: 0,
          updated_at: "2025-04-23 13:35:14"
        },
        {
          hospital_district_id: 3,
          hospital_district_no: "003",
          hospital_district_name: "黄埔院区1",
          is_use: 1,
          status: 1,
          hospital_district_ids: null,
          create_by: 1,
          created_at: "2024-11-22 15:28:25",
          update_by: 16,
          updated_at: "2024-11-28 10:18:46"
        },
        {
          hospital_district_id: 4,
          hospital_district_no: "004",
          hospital_district_name: "越秀院区",
          is_use: 1,
          status: 1,
          hospital_district_ids: null,
          create_by: 16,
          created_at: "2024-11-26 09:20:05",
          update_by: 16,
          updated_at: "2024-11-28 10:18:06"
        },
        {
          hospital_district_id: 6,
          hospital_district_no: "005",
          hospital_district_name: "测试院区3",
          is_use: 1,
          status: 1,
          hospital_district_ids: null,
          create_by: 16,
          created_at: "2024-11-27 09:38:52",
          update_by: 0,
          updated_at: "2025-04-27 15:49:30"
        },
        {
          hospital_district_id: 7,
          hospital_district_no: "SUPER01",
          hospital_district_name: "超级无敌院区一号",
          is_use: 1,
          status: 1,
          hospital_district_ids: null,
          create_by: 22,
          created_at: "2024-12-20 11:10:04",
          update_by: 0,
          updated_at: "2024-12-20 11:10:04"
        },
        {
          hospital_district_id: 8,
          hospital_district_no: "CES01",
          hospital_district_name: "测试院区01",
          is_use: 1,
          status: 1,
          hospital_district_ids: null,
          create_by: 16,
          created_at: "2024-12-26 10:25:54",
          update_by: 0,
          updated_at: "2024-12-26 10:25:54"
        },
        {
          hospital_district_id: 9,
          hospital_district_no: "ces02",
          hospital_district_name: "测试院区02",
          is_use: 0,
          status: 1,
          hospital_district_ids: null,
          create_by: 16,
          created_at: "2024-12-26 10:26:07",
          update_by: 0,
          updated_at: "2024-12-26 10:26:07"
        },
        {
          hospital_district_id: 10,
          hospital_district_no: "ces03",
          hospital_district_name: "测试院区03",
          is_use: 0,
          status: 1,
          hospital_district_ids: null,
          create_by: 16,
          created_at: "2024-12-26 10:26:23",
          update_by: 0,
          updated_at: "2024-12-26 10:26:23"
        },
        {
          hospital_district_id: 11,
          hospital_district_no: "ces04",
          hospital_district_name: "测试院区04",
          is_use: 0,
          status: 1,
          hospital_district_ids: null,
          create_by: 16,
          created_at: "2024-12-26 10:26:35",
          update_by: 0,
          updated_at: "2024-12-26 10:26:35"
        },
        {
          hospital_district_id: 12,
          hospital_district_no: "ces05",
          hospital_district_name: "测试院区05",
          is_use: 0,
          status: 1,
          hospital_district_ids: null,
          create_by: 16,
          created_at: "2024-12-26 10:26:49",
          update_by: 0,
          updated_at: "2024-12-26 10:26:49"
        },
        {
          hospital_district_id: 13,
          hospital_district_no: "ces06",
          hospital_district_name: "测试院区06",
          is_use: 0,
          status: 1,
          hospital_district_ids: null,
          create_by: 16,
          created_at: "2024-12-26 10:27:04",
          update_by: 0,
          updated_at: "2024-12-26 10:27:04"
        },
        {
          hospital_district_id: 14,
          hospital_district_no: "ces07",
          hospital_district_name: "测试院区07",
          is_use: 0,
          status: 1,
          hospital_district_ids: null,
          create_by: 16,
          created_at: "2024-12-26 10:27:17",
          update_by: 0,
          updated_at: "2024-12-26 10:27:17"
        },
        {
          hospital_district_id: 15,
          hospital_district_no: "ces08",
          hospital_district_name: "测试院区08",
          is_use: 0,
          status: 1,
          hospital_district_ids: null,
          create_by: 16,
          created_at: "2024-12-26 10:27:26",
          update_by: 0,
          updated_at: "2024-12-26 10:27:26"
        },
        {
          hospital_district_id: 16,
          hospital_district_no: "ces09",
          hospital_district_name: "测试院区09",
          is_use: 0,
          status: 1,
          hospital_district_ids: null,
          create_by: 16,
          created_at: "2024-12-26 10:27:51",
          update_by: 0,
          updated_at: "2024-12-26 10:27:51"
        },
        {
          hospital_district_id: 17,
          hospital_district_no: "ces10",
          hospital_district_name: "测试院区10",
          is_use: 0,
          status: 1,
          hospital_district_ids: null,
          create_by: 16,
          created_at: "2024-12-26 10:28:00",
          update_by: 0,
          updated_at: "2024-12-26 10:28:00"
        },
        {
          hospital_district_id: 18,
          hospital_district_no: "ces11",
          hospital_district_name: "测试院区11",
          is_use: 0,
          status: 1,
          hospital_district_ids: null,
          create_by: 16,
          created_at: "2024-12-26 10:31:01",
          update_by: 0,
          updated_at: "2024-12-26 10:31:01"
        },
        {
          hospital_district_id: 19,
          hospital_district_no: "ces12",
          hospital_district_name: "测试院区12",
          is_use: 0,
          status: 1,
          hospital_district_ids: null,
          create_by: 16,
          created_at: "2024-12-26 10:31:14",
          update_by: 0,
          updated_at: "2024-12-26 10:31:14"
        },
        {
          hospital_district_id: 20,
          hospital_district_no: "ces13",
          hospital_district_name: "测试院区13",
          is_use: 0,
          status: 1,
          hospital_district_ids: null,
          create_by: 16,
          created_at: "2024-12-26 10:31:23",
          update_by: 0,
          updated_at: "2024-12-26 10:31:23"
        },
        {
          hospital_district_id: 21,
          hospital_district_no: "ces14",
          hospital_district_name: "测试院区14",
          is_use: 0,
          status: 1,
          hospital_district_ids: null,
          create_by: 16,
          created_at: "2024-12-26 10:31:33",
          update_by: 0,
          updated_at: "2024-12-26 10:31:33"
        }
      ];

      // 支持按院区名称搜索
      if (body?.hospital_district_name) {
        list = list.filter(item =>
          item.hospital_district_name.includes(body.hospital_district_name)
        );
      }

      // 支持按院区编号搜索
      if (body?.hospital_district_no) {
        list = list.filter(item =>
          item.hospital_district_no.includes(body.hospital_district_no)
        );
      }

      // 支持按状态筛选
      if (
        body?.status !== undefined &&
        body?.status !== null &&
        body?.status !== ""
      ) {
        list = list.filter(item => item.status === body.status);
      }

      // 支持按是否启用筛选
      if (
        body?.is_use !== undefined &&
        body?.is_use !== null &&
        body?.is_use !== ""
      ) {
        list = list.filter(item => item.is_use === body.is_use);
      }

      return {
        success: true,
        data: {
          list,
          total: list.length,
          pageSize: body?.pageSize || 10,
          currentPage: body?.currentPage || 1
        }
      };
    }
  },
  // 院区配置-启用/停用
  {
    url: "/hospital-district/switch-status",
    method: "post",
    response: ({ body }) => {
      const { ids } = body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return {
          success: false,
          message: "请选择要操作的院区"
        };
      }
      // 模拟更新状态：将 status 从 1 切换为 -1，或从 -1 切换为 1
      return {
        success: true,
        message: "操作成功",
        data: {
          ids
        }
      };
    }
  },
  // 院区配置-删除
  {
    url: "/hospital-district/delete",
    method: "post",
    response: ({ body }) => {
      const { ids } = body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return {
          success: false,
          message: "请选择要删除的院区"
        };
      }
      return {
        success: true,
        message: "删除成功",
        data: {
          ids
        }
      };
    }
  },
  // 样本处理流程-列表
  {
    url: "/task-type",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          task_type_id: 18,
          task_type_name: "转移",
          task_type_code: "zy",
          task_type_desc: "转移",
          is_other_operation: 1,
          status: 1,
          display: 1,
          sort: 0,
          is_use: 1,
          is_def: 0,
          tracker_button: "",
          is_record_end_time: -1,
          can_transfer: 1,
          is_merge_tube: -1,
          is_countdown: -1,
          create_by: 8,
          created_at: "2024-06-11 11:22:36",
          update_by: 8,
          updated_at: "2024-10-09 10:21:47"
        },
        {
          task_type_id: 28,
          task_type_name: "37℃孵育",
          task_type_code: "37℃孵育",
          task_type_desc: "37℃孵育",
          is_other_operation: 1,
          status: 1,
          display: 1,
          sort: 0,
          is_use: 1,
          is_def: 0,
          tracker_button: "",
          is_record_end_time: 1,
          can_transfer: -1,
          is_merge_tube: -1,
          is_countdown: 1,
          create_by: 8,
          created_at: "2025-05-13 09:54:46",
          update_by: 8,
          updated_at: "2025-05-13 09:54:51"
        },
        {
          task_type_id: 27,
          task_type_name: "合管测试",
          task_type_code: "heguances",
          task_type_desc: "",
          is_other_operation: 1,
          status: 1,
          display: 1,
          sort: 0,
          is_use: 0,
          is_def: 0,
          tracker_button: "",
          is_record_end_time: 1,
          can_transfer: -1,
          is_merge_tube: -1,
          is_countdown: 1,
          create_by: 8,
          created_at: "2025-05-13 09:26:17",
          update_by: 8,
          updated_at: "2025-05-13 09:38:47"
        },
        {
          task_type_id: 26,
          task_type_name: "分管",
          task_type_code: "fengaun",
          task_type_desc: "",
          is_other_operation: 1,
          status: 1,
          display: 1,
          sort: 0,
          is_use: 1,
          is_def: 0,
          tracker_button: "",
          is_record_end_time: -1,
          can_transfer: 1,
          is_merge_tube: -1,
          is_countdown: -1,
          create_by: 16,
          created_at: "2025-01-15 13:36:53",
          update_by: 16,
          updated_at: "2025-01-15 13:37:23"
        },
        {
          task_type_id: 19,
          task_type_name: "涡旋(新)",
          task_type_code: "wxnew",
          task_type_desc: "",
          is_other_operation: 1,
          status: 1,
          display: 1,
          sort: 0,
          is_use: 1,
          is_def: 0,
          tracker_button: "",
          is_record_end_time: 1,
          can_transfer: -1,
          is_merge_tube: -1,
          is_countdown: -1,
          create_by: 8,
          created_at: "2024-08-05 11:18:02",
          update_by: 8,
          updated_at: "2024-08-05 11:18:11"
        },
        {
          task_type_id: 13,
          task_type_name: "接收",
          task_type_code: "check_in",
          task_type_desc: "样本接收入库",
          is_other_operation: -1,
          status: 1,
          display: 1,
          sort: 1,
          is_use: 1,
          is_def: 1,
          tracker_button: "",
          is_record_end_time: -1,
          can_transfer: -1,
          is_merge_tube: -1,
          is_countdown: -1,
          create_by: 1,
          created_at: "2020-09-18 10:03:14",
          update_by: 8,
          updated_at: "2020-11-19 13:21:15"
        },
        {
          task_type_id: 1,
          task_type_name: "静置",
          task_type_code: "stand",
          task_type_desc: "静置",
          is_other_operation: -1,
          status: 1,
          display: 1,
          sort: 2,
          is_use: 1,
          is_def: 1,
          tracker_button: "",
          is_record_end_time: -1,
          can_transfer: -1,
          is_merge_tube: -1,
          is_countdown: -1,
          create_by: 1,
          created_at: "2020-08-25 17:10:32",
          update_by: 8,
          updated_at: "2020-11-19 13:21:18"
        },
        {
          task_type_id: 2,
          task_type_name: "离心",
          task_type_code: "centrifuge",
          task_type_desc: "离心操作",
          is_other_operation: -1,
          status: 1,
          display: 1,
          sort: 3,
          is_use: 1,
          is_def: 1,
          tracker_button: "",
          is_record_end_time: -1,
          can_transfer: -1,
          is_merge_tube: -1,
          is_countdown: -1,
          create_by: 1,
          created_at: "2020-08-10 10:09:31",
          update_by: 0,
          updated_at: "2024-10-09 10:22:05"
        },
        {
          task_type_id: 3,
          task_type_name: "分装",
          task_type_code: "transfer",
          task_type_desc: "分装操作",
          is_other_operation: -1,
          status: 1,
          display: 1,
          sort: 4,
          is_use: 1,
          is_def: 1,
          tracker_button: "",
          is_record_end_time: -1,
          can_transfer: 1,
          is_merge_tube: -1,
          is_countdown: -1,
          create_by: 1,
          created_at: "2020-08-10 10:11:14",
          update_by: 0,
          updated_at: "2020-11-19 13:21:25"
        },
        {
          task_type_id: 4,
          task_type_name: "弃置",
          task_type_code: "discard",
          task_type_desc: "弃置",
          is_other_operation: -1,
          status: 1,
          display: 1,
          sort: 5,
          is_use: 1,
          is_def: 1,
          tracker_button: "",
          is_record_end_time: -1,
          can_transfer: -1,
          is_merge_tube: -1,
          is_countdown: -1,
          create_by: 1,
          created_at: "2020-08-10 10:11:53",
          update_by: 0,
          updated_at: "2020-11-19 13:21:29"
        }
      ];

      // 支持按流程名称搜索
      if (body?.task_type_name) {
        list = list.filter(item =>
          item.task_type_name.includes(body.task_type_name)
        );
      }

      // 支持按流程编码搜索
      if (body?.task_type_code) {
        list = list.filter(item =>
          item.task_type_code.includes(body.task_type_code)
        );
      }

      return {
        success: true,
        data: {
          list,
          total: list.length,
          pageSize: body?.pageSize || 10,
          currentPage: body?.currentPage || 1
        }
      };
    }
  },
  // 样本处理流程-启用/停用
  {
    url: "/task-type/switch-status",
    method: "post",
    response: ({ body }) => {
      const { ids } = body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return {
          success: false,
          message: "请选择要操作的流程"
        };
      }
      return {
        success: true,
        message: "操作成功",
        data: {
          ids
        }
      };
    }
  },
  // 样本处理流程-删除
  {
    url: "/task-type/delete",
    method: "post",
    response: ({ body }) => {
      const { ids } = body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return {
          success: false,
          message: "请选择要删除的流程"
        };
      }
      return {
        success: true,
        message: "删除成功",
        data: {
          ids
        }
      };
    }
  },
  // 房间管理-列表
  {
    url: "/room",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          room_id: 8,
          room_name: "CES1",
          room_no: "",
          order_by: 1,
          hospital_district_id: 26,
          hospital_district_name: "CESYUANQU",
          create_by: 8,
          created_at: "2025-07-30 14:26:25",
          update_by: 0,
          updated_at: "2025-07-30 14:26:25"
        },
        {
          room_id: 6,
          room_name: "超级无敌房间01",
          room_no: "",
          order_by: 1,
          hospital_district_id: 7,
          hospital_district_name: "超级无敌院区一号",
          create_by: 22,
          created_at: "2024-12-20 11:10:27",
          update_by: 0,
          updated_at: "2024-12-20 11:10:27"
        },
        {
          room_id: 5,
          room_name: "越秀院区-房间001",
          room_no: "",
          order_by: 1,
          hospital_district_id: 4,
          hospital_district_name: "越秀院区",
          create_by: 16,
          created_at: "2024-11-27 16:09:40",
          update_by: 0,
          updated_at: "2024-11-27 16:09:40"
        },
        {
          room_id: 4,
          room_name: "黄埔院区-房间001",
          room_no: "",
          order_by: 1,
          hospital_district_id: 3,
          hospital_district_name: "黄埔院区1",
          create_by: 16,
          created_at: "2024-11-27 14:37:42",
          update_by: 0,
          updated_at: "2024-11-27 14:37:42"
        },
        {
          room_id: 2,
          room_name: "I期病房处置室",
          room_no: "",
          order_by: 1,
          hospital_district_id: 2,
          hospital_district_name: "北京肿瘤",
          create_by: 2,
          created_at: "2024-07-17 15:06:34",
          update_by: 0,
          updated_at: "2024-07-17 15:06:34"
        },
        {
          room_id: 1,
          room_name: "客户端",
          room_no: "",
          order_by: 1,
          hospital_district_id: 1,
          hospital_district_name: "测试院区1",
          create_by: 1,
          created_at: "2024-06-11 14:05:16",
          update_by: 0,
          updated_at: "2024-06-11 14:05:16"
        },
        {
          room_id: 7,
          room_name: "超级无敌房间02",
          room_no: "",
          order_by: 2,
          hospital_district_id: 7,
          hospital_district_name: "超级无敌院区一号",
          create_by: 22,
          created_at: "2024-12-20 11:10:37",
          update_by: 0,
          updated_at: "2024-12-20 11:10:37"
        }
      ];

      // 支持按房间名称搜索
      if (body?.room_name) {
        list = list.filter(item => item.room_name.includes(body.room_name));
      }

      // 支持按院区名称搜索
      if (body?.hospital_district_name) {
        list = list.filter(item =>
          item.hospital_district_name.includes(body.hospital_district_name)
        );
      }

      return {
        success: true,
        data: {
          list,
          total: list.length,
          pageSize: body?.pageSize || 10,
          currentPage: body?.currentPage || 1
        }
      };
    }
  },
  // 房间管理-删除
  {
    url: "/room/delete",
    method: "post",
    response: ({ body }) => {
      const { ids } = body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return {
          success: false,
          message: "请选择要删除的房间"
        };
      }
      return {
        success: true,
        message: "删除成功",
        data: {
          ids
        }
      };
    }
  },
  // 设备管理-获取设备列表
  {
    url: "/device",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          device_id: 4967,
          room_id: 1,
          room_name: "客户端",
          parent_id: 0,
          parent_device_name: "",
          device_barcode: "C0100021",
          device_name: "离心机1号",
          device_type_id: 1,
          device_type_name: "离心机",
          device_type_code: "centrifuge",
          brand: "",
          floors: 0,
          rows: 1,
          columns: 1,
          ref_run_temperature: 0,
          ref_run_speed: 0,
          ref_run_duration: 0,
          current_run_temperature: "常温",
          current_run_speed: 1200,
          current_run_duration: 1,
          current_use_batch_log_id: 650,
          last_use_batch_log_id: 650,
          is_shelf: 0,
          is_store: 0,
          status: 1,
          sort: 0,
          store_j_number: 0,
          store_n_number: 0,
          centrifuge_type_id: "2",
          centrifuge_type_name: "低温",
          device_no: "123dfasd123123",
          device_model: "123123123",
          transfer_types: "",
          create_by: 1,
          created_at: "2024-06-11 14:05:35",
          FridgeFloors: [],
          ParentFridgeFloor: {
            device_id: 0,
            room_id: 0,
            parent_id: 0,
            parent_device_barcode: "",
            parent_device_name: "",
            device_type_code: "",
            device_barcode: "",
            device_name: "",
            device_type_id: 0,
            device_type_name: "",
            brand: "",
            floors: 0,
            rows: 0,
            columns: 0,
            is_shelf: 0,
            is_store: 0,
            is_floor: 0,
            status: 0,
            sort: 0,
            create_by: 0,
            created_at: "",
            update_by: 0,
            updated_at: "",
            DeviceType: {
              device_type_id: 0,
              device_type_name: "",
              device_type_code: "",
              last_number: 0,
              status: 0,
              is_use: 0,
              create_by: 0,
              created_at: "",
              update_by: 0,
              updated_at: ""
            },
            ParentFridge: {
              device_id: 0,
              room_id: 0,
              parent_id: 0,
              parent_device_barcode: "",
              parent_device_name: "",
              device_type_code: "",
              device_barcode: "",
              device_name: "",
              device_type_id: 0,
              device_type_name: "",
              brand: "",
              floors: 0,
              rows: 0,
              columns: 0,
              is_shelf: 0,
              is_store: 0,
              is_floor: 0,
              status: 0,
              sort: 0,
              create_by: 0,
              created_at: "",
              update_by: 0,
              updated_at: "",
              DeviceType: {
                device_type_id: 0,
                device_type_name: "",
                device_type_code: "",
                last_number: 0,
                status: 0,
                is_use: 0,
                create_by: 0,
                created_at: "",
                update_by: 0,
                updated_at: ""
              }
            }
          }
        },
        {
          device_id: 5000,
          room_id: 1,
          room_name: "客户端",
          parent_id: 0,
          parent_device_name: "",
          device_barcode: "F0100001",
          device_name: "冰箱1号",
          device_type_id: 2,
          device_type_name: "冰箱",
          device_type_code: "fridge",
          brand: "海尔",
          floors: 3,
          rows: 2,
          columns: 4,
          ref_run_temperature: 4,
          ref_run_speed: 0,
          ref_run_duration: 0,
          current_run_temperature: "4℃",
          current_run_speed: 0,
          current_run_duration: 0,
          current_use_batch_log_id: 0,
          last_use_batch_log_id: 0,
          is_shelf: 0,
          is_store: 0,
          status: 1,
          sort: 0,
          store_j_number: 0,
          store_n_number: 0,
          centrifuge_type_id: "",
          centrifuge_type_name: "",
          device_no: "F001",
          device_model: "BCD-215STPH",
          transfer_types: "",
          create_by: 1,
          created_at: "2024-06-12 10:00:00",
          FridgeFloors: [
            {
              device_id: 5001,
              device_barcode: "FL001",
              device_name: "第1层",
              floors: 1,
              rows: 2,
              columns: 4,
              status: 1
            },
            {
              device_id: 5002,
              device_barcode: "FL002",
              device_name: "第2层",
              floors: 2,
              rows: 2,
              columns: 4,
              status: 1
            },
            {
              device_id: 5003,
              device_barcode: "FL003",
              device_name: "第3层",
              floors: 3,
              rows: 2,
              columns: 4,
              status: 1
            }
          ],
          ParentFridgeFloor: {
            device_id: 0,
            room_id: 0,
            parent_id: 0,
            parent_device_barcode: "",
            parent_device_name: "",
            device_type_code: "",
            device_barcode: "",
            device_name: "",
            device_type_id: 0,
            device_type_name: "",
            brand: "",
            floors: 0,
            rows: 0,
            columns: 0,
            is_shelf: 0,
            is_store: 0,
            is_floor: 0,
            status: 0,
            sort: 0,
            create_by: 0,
            created_at: "",
            update_by: 0,
            updated_at: "",
            DeviceType: {
              device_type_id: 0,
              device_type_name: "",
              device_type_code: "",
              last_number: 0,
              status: 0,
              is_use: 0,
              create_by: 0,
              created_at: "",
              update_by: 0,
              updated_at: ""
            },
            ParentFridge: {
              device_id: 0,
              room_id: 0,
              parent_id: 0,
              parent_device_barcode: "",
              parent_device_name: "",
              device_type_code: "",
              device_barcode: "",
              device_name: "",
              device_type_id: 0,
              device_type_name: "",
              brand: "",
              floors: 0,
              rows: 0,
              columns: 0,
              is_shelf: 0,
              is_store: 0,
              is_floor: 0,
              status: 0,
              sort: 0,
              create_by: 0,
              created_at: "",
              update_by: 0,
              updated_at: "",
              DeviceType: {
                device_type_id: 0,
                device_type_name: "",
                device_type_code: "",
                last_number: 0,
                status: 0,
                is_use: 0,
                create_by: 0,
                created_at: "",
                update_by: 0,
                updated_at: ""
              }
            }
          }
        }
      ];

      // 支持按设备类型搜索
      if (body?.device_type_id) {
        list = list.filter(item => item.device_type_id === body.device_type_id);
      }

      // 支持按房间搜索
      if (body?.room_id) {
        list = list.filter(item => item.room_id === body.room_id);
      }

      // 支持按设备编码搜索
      if (body?.device_barcode) {
        list = list.filter(item =>
          item.device_barcode.includes(body.device_barcode)
        );
      }

      return {
        success: true,
        data: {
          list,
          total: list.length,
          pageSize: body?.pageSize || 10,
          currentPage: body?.currentPage || 1
        }
      };
    }
  },
  // 设备管理-获取设备类型列表
  {
    url: "/device-type",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [
          {
            device_type_code: "centrifuge",
            device_type_id: 1,
            device_type_name: "离心机"
          },
          {
            device_type_code: "fridge",
            device_type_id: 2,
            device_type_name: "冰箱"
          },
          {
            device_type_code: "box",
            device_type_id: 4,
            device_type_name: "盒子"
          }
        ]
      };
    }
  },
  // 设备管理-删除
  {
    url: "/device/delete",
    method: "post",
    response: ({ body }) => {
      const { ids } = body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return {
          success: false,
          message: "请选择要删除的设备"
        };
      }
      return {
        success: true,
        message: "删除成功",
        data: {
          ids
        }
      };
    }
  },
  // 设备管理-新增储位
  {
    url: "/device/store",
    method: "post",
    response: ({ body }) => {
      const { parent_device_id, device_name } = body;
      if (!device_name) {
        return {
          success: false,
          message: "请输入储位名称"
        };
      }
      return {
        success: true,
        message: "新增成功",
        data: {
          device_id: Date.now(),
          device_name,
          parent_device_id,
          device_barcode: `ST${Date.now()}`,
          floors: 0,
          rows: 0,
          columns: 0,
          status: 1
        }
      };
    }
  },
  // 设备管理-修改储位
  {
    url: "/device/store/update",
    method: "post",
    response: ({ body }) => {
      const { device_id, device_name } = body;
      if (!device_name) {
        return {
          success: false,
          message: "请输入储位名称"
        };
      }
      return {
        success: true,
        message: "修改成功",
        data: {
          device_id,
          device_name
        }
      };
    }
  },
  // 设备管理-删除储位
  {
    url: "/device/store/delete",
    method: "post",
    response: ({ body }) => {
      const { ids } = body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return {
          success: false,
          message: "请选择要删除的储位"
        };
      }
      return {
        success: true,
        message: "删除成功",
        data: {
          ids
        }
      };
    }
  },
  // 设备管理-切换状态
  {
    url: "/device/status",
    method: "post",
    response: ({ body }) => {
      const { device_id } = body;
      if (!device_id) {
        return {
          success: false,
          message: "设备ID不能为空"
        };
      }
      return {
        success: true,
        message: "状态切换成功",
        data: {
          device_id
        }
      };
    }
  }
]);
