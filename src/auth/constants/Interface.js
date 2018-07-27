export default {
    sourceRulesUrl: {
        add: '/sourceRule/add',
        delete: '/rbac/deleteResourceRule',
        get: '/sourceRule/getSourceRules'
    },
    roleUrl: {
        add: '/rbac/addRoles',
        delete: '/rbac/deleteRoles',
        update: '/rbac/updateRoles',
        get: '/rbac/getRolesList'
    },
    roleRelationUrl: {
        update: '/rbac/operateUserRole',
        get: '/rbac/getUserRoleList'
    },
    roleAuthorityUrl: {
        get: '/rbac/getRolesAssignments',
        add: '/rbac/operateAssignments',
        delete: '/rbac/deleteAssignments'
    },
    authority: {
        get: '/rbac/getUserRoleAssignments'
    },
    navGroupUrl: {
        get: '/rbac/getNavigationAssembly',
        add: '/rbac/addNavigationCombinations',
        update: '/rbac/updateNavigationCombinations',
        delete: '/rbac/deleteNavigationCombinations'
    }

}
