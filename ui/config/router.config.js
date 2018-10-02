module.exports = [
    {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
            {
                path: "/", redirect: "/dashboard",
            },
            {
                path: '/dashboard', component: "./Dashboard", name: 'dashboard', icon: 'table',
            },
        ],
    }
]