module.exports = [
    {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
            {
                path: '/dashboard', name: 'dashboard', icon: 'table',
                routes: [
                    { path: '/dashboard/list', component: './Dashboard/', name: 'listview' },
                ]
            },
        ],
    }
]