export const menus = [
  {
    chip: { value: "A", color: "accent" },
    name: "Dashboard",
    icon: "dashboard",
    link: false,
    open: false,
    sub: [
      {
        name: "A01-Current Machine Status",
        link: "real-time-monitoring/current-machine-status-list",
        icon: "dashboard",
        chip: false,
        open: true
      },
      {
        name: "A02-Current Produce Status",
        link: "real-time-monitoring/neotex-dashboard",
        icon: "dashboard",
        chip: false,
        open: true
      },
      // {
      //     "name": "Dashboard",
      //     "link": "/auth/dashboard",
      //     "icon": "dashboard",
      //     "chip": false,
      //     "open": true,
      // },
      {
        name: "A03-Real-Time Monitoring",
        link: "real-time-monitoring/",
        icon: "show_chart",
        chip: false,
        open: true
      }
    ]
  },
  {
    name: "History Data",
    icon: "list",
    link: false,
    open: false,
    chip: { value: "B", color: "accent" },
    sub: [
      {
        name: "B01-Machine History Status",
        link: "real-time-monitoring/machine-history-status",
        icon: "description",
        chip: false,
        open: true
      },
      {
        name: "B02-Machine Summary Status",
        link: "real-time-monitoring/machine-summary-status",
        icon: "developer_board",
        chip: false,
        open: true
      },
      {
        name: "B03-Machine Daily Log",
        link: "real-time-monitoring/machine-daily-log",
        icon: "developer_board",
        chip: false,
        open: true
      }
    ]
  },
  {
    name: "Transaction",
    icon: "list",
    link: false,
    open: false,
    chip: { value: "C", color: "accent" },
    sub: [
      {
        name: "C01-Production Order",
        link: "transaction/production-order-listing",
        icon: "description",
        chip: false,
        open: true
      },
      {
        name: "C02-Production Planing",
        link: "transaction/production-planing",
        icon: "developer_board",
        chip: false,
        open: true
      },
      {
        name: "C03-Production Order Closure",
        link: "transaction/production-order-closure",
        icon: "developer_board",
        chip: false,
        open: true
      }
    ]
  },
  {
    name: "Reports",
    icon: "description",
    link: false,
    open: false,
    chip: { value: "D", color: "accent" },
    sub: [
      {
        name: "D01-Production Plan Report",
        link: "reports/production-plan",
        icon: "description",
        chip: false,
        open: true
      },
      {
        name: "D02 Production Order Status Report",
        link: "reports/production-order-status",
        icon: "description",
        chip: false,
        open: true
      },
      {
        name: "D03 Production Lead Time Report",
        link: "reports/production-lead-time",
        icon: "description",
        chip: false,
        open: true
      },
      {
        name: "D04-Daily Production Report",
        link: "reports/report-dailyproduction",
        icon: "description",
        chip: false,
        open: true
      },
      {
        name: "D05-Daily Packing List Report",
        link: "reports/daily-packing-list-report",
        icon: "description",
        chip: false,
        open: true
      },
      {
        name: "D06-WIP Report",
        link: "reports/wip-report",
        icon: "description",
        chip: false,
        open: true
      },
      {
        name: "D07-Check Standard Report",
        link: "reports/check-standard-report",
        icon: "description",
        chip: false,
        open: true
      },
      {
        name: "D08-Check Temp and Widths Report",
        link: "reports/checktempandwidths-report",
        icon: "description",
        chip: false,
        open: true
      },
      {
        name: "D09-Order Closured Summary Report",
        link: "reports/production-order-closured-summary-report",
        icon: "description",
        chip: false,
        open: true
      },
      {
        name: "D10-Length loss by process report",
        link: "reports/length-loss-report",
        icon: "description",
        chip: false,
        open: true
      },
      {
        name: "D11-Histogram Weight Analysis Report",
        link: "reports/histogram-weigth-analysis-report",
        icon: "description",
        chip: false,
        open: true
      },
      {
        name: "D12-Monthly Performance Report",
        link: "reports/monthly-performance-report",
        icon: "description",
        chip: false,
        open: true
      },
     
    ]

  },
  {
    name: "Master",
    icon: "folder_shared",
    link: false,
    open: false,
    chip: { value: "E", color: "accent" },
    sub: [
      {
        name: "E01-Account",
        link: "master/account-listing",
        icon: "account_circle",
        chip: false,
        open: true
      },
      {
        name: "E02-Article",
        link: "master/article-listing",
        icon: "assignment",
        chip: false,
        open: true
      },
      {
        name: "E03-Country",
        link: "master/country-listing",
        icon: "touch_app",
        chip: false,
        open: true
      },
      {
        name: "E04-Customer",
        link: "master/customer-listing",
        icon: "person",
        chip: false,
        open: true
      },
      {
        name: "E05-Defect",
        link: "master/defect-listing",
        icon: "bug_report",
        chip: false,
        open: true
      },
      {
        name: "E06-Grade",
        link: "master/grade-listing",
        icon: "spellcheck",
        chip: false,
        open: true
      },
      {
        name: "E07-Machine Check List",
        link: "master/machine-check-list-listing",
        icon: "playlist_add_check",
        chip: false,
        open: true
      },
      {
        name: "E08-Machine",
        link: "master/machine-listing",
        icon: "wb_iridescent",
        chip: false,
        open: true
      },
      {
        name: "E09-Process",
        link: "master/process-listing",
        icon: "settings_applications",
        chip: false,
        open: true
      },
      {
        name: "E10-Product",
        link: "master/products-listing",
        icon: "shopping_cart",
        chip: false,
        open: true
      },
      {
        name: "E11-Raw Material",
        link: "master/raw-material-listing",
        icon: "view_module",
        chip: false,
        open: true
      },
      {
        name: "E12-Shift Schdule",
        link: "master/shift-schdule-listing",
        icon: "schedule",
        chip: false,
        open: true
      },
      {
        name: "E13-Standard",
        link: "master/standard-listing",
        icon: "settings_applications",
        chip: false,
        open: true
      },
      {
        name: "E14-Station",
        link: "master/station-listing",
        icon: "build",
        chip: false,
        open: true
      },
      {
        name: "E15-Station Group",
        link: "master/stationgroup-listing",
        icon: "settings_input_hdmi",
        chip: false,
        open: true
      },
      {
        name: "E16-Sys Role",
        link: "master/sysrole-listing",
        icon: "contacts",
        chip: false,
        open: true
      },
      {
        name: "E17-Team",
        link: "master/team-listing",
        icon: "group_add",
        chip: false,
        open: true
      },
      {
        name: "E18-Tirotedge",
        link: "master/tirotedge-listing",
        icon: "g_translate",
        chip: false,
        open: true
      },
      {
        name: "E19-UOM",
        link: "master/uom-listing",
        icon: "swap_horiz",
        chip: false,
        open: true
      }
   
   
    ]
  }
  // {
  //     "name": "Material Widget",
  //     "icon": "widgets",
  //     "link": false,
  //     "open": false,
  //     "sub": [
  //         {
  //             "name": "Buttons",
  //             "link": "material-widgets/buttons",
  //             "icon": "indeterminate_check_box",
  //             "chip": false,
  //             "open": false,
  //         },
  //         {
  //             "name": "List",
  //             "link": "material-widgets/list",
  //             "icon": "list",
  //             "chip": false,
  //             "open": false,
  //         },
  //         {

  //             "name": "Stepper",
  //             "link": "material-widgets/stepper",
  //             "icon": "view_week",
  //             "chip": false,
  //             "open": false,

  //         },
  //         {
  //             "name": "Expansion",
  //             "link": "material-widgets/expansion",
  //             "icon": "web_aaset",
  //             "chip": false,
  //             "open": false,
  //         },
  //         {
  //             "name": "Progress Spinner",
  //             "link": "material-widgets/spinner",
  //             "icon": "cached",
  //             "chip": false,
  //             "open": false,
  //         },
  //         {
  //             "name": "Cards",
  //             "link": "material-widgets/cards",
  //             "icon": "crop_16_9",
  //             "chip": false,
  //             "open": false,
  //         },
  //         {
  //             "name": "Icons",
  //             "link": "material-widgets/icons",
  //             "icon": "gif",
  //             "chip": false,
  //             "open": false,
  //         },
  //         {

  //             "name": "AutoComplete",
  //             "link": "material-widgets/autocomplete",
  //             "icon": "get_app",
  //             "chip": false,
  //             "open": false,
  //         },
  //         {
  //             "name": "CheckBox",
  //             "link": "material-widgets/checkbox",
  //             "icon": "check_box",
  //             "chip": false,
  //             "open": false,
  //         },
  //         {
  //             "name": "DatePicker",
  //             "link": "material-widgets/datepicker",
  //             "icon": "date_range",
  //             "chip": false,
  //             "open": false,
  //         },

  //         {
  //             "name": "Slider",
  //             "link": "material-widgets/slider",
  //             "icon": "keyboard_tab",
  //             "chip": false,
  //             "open": false,

  //         },
  //         {
  //             "name": "Slide Toggle",
  //             "link": "material-widgets/slide-toggle",
  //             "icon": "album",
  //             "chip": false,
  //             "open": false,

  //         },
  //         {
  //             "name": "Menu",
  //             "icon": "menu",
  //             "link": "material-widgets/menu",
  //             "chip": false,
  //             "open": false,
  //         },
  //         {
  //             "name": "Progress Bar",
  //             "link": "material-widgets/progress-bar",
  //             "icon": "trending_flat",
  //             "chip": false,
  //             "open": false,

  //         },
  //         {
  //             "name": "Input",
  //             "icon": "input",
  //             "link": "material-widgets/input",
  //             "open": false,
  //         },
  //         {
  //             "name": "Radio",
  //             "icon": "radio_button_checked",
  //             "link": "material-widgets/radio",
  //             "chip": false,
  //             "open": false,
  //         },
  //         {
  //             "name": "Select",
  //             "icon": "select_all",
  //             "link": "material-widgets/select",
  //             "open": false,
  //         },
  //     ]
  // },
  // {
  //     "name"   : "Forms",
  //     "icon"   : "mode_edit",
  //     "open"   : false,
  //     "link"   : false,
  //     "sub"    :  [
  //                     {
  //                         "name": "Template Driven",
  //                         "icon": "mode_edit",
  //                         "open"   : false,
  //                         "link":"forms/template_forms"
  //                     },
  //                     {
  //                         "name": "Reactive Forms",
  //                         "icon": "text_fields",
  //                         "open"   : false,
  //                         "link":"forms/reactive_forms"
  //                     }
  //                 ]
  // },
  // {
  //     "name": "Tables",
  //     "icon": "list",
  //     "link": false,
  //     "open": false,
  //     "chip": { "value": 2, 'color': 'accent' },
  //     "sub": [
  //         {
  //             "name": "Fixed",
  //             "icon": "filter_list",
  //             "link": "tables/fixed",
  //             "open": false,
  //         },
  //         {
  //             "name": "Feature",
  //             "icon": "done_all",
  //             "link": "tables/featured",
  //             "open": false,
  //         },
  //         {
  //             "name": "Responsive Tables",
  //             "icon": "filter_center_focus",
  //             "link": "tables/responsive",
  //             "open": false,
  //         }
  //     ]

  // },
  // {
  //     "name": "Guarded Routes",
  //     "icon": "mode_edit",
  //     "link": "/auth/guarded-routes",
  //     "open": false,

  // }, {
  //     "name": "Scrumboard",
  //     "open": false,
  //     "link": "/auth/scrumboard",
  //     "icon": "grade",
  // }, {
  //     "name": "Applications",
  //     "icon": "view_module",
  //     "open": false,
  //     "link": false,
  //     "sub": [
  //         {
  //             "name": "chat",
  //             "icon": "chat",
  //             "link": "chats/chat",
  //             "open": false,
  //         },
  //         {
  //             "name": "mail",
  //             "icon": "mail",
  //             "link": "mail/mail",
  //             "open": false,
  //         },
  //         {
  //             "name": "Editor",
  //             "icon": "editor",
  //             "link": "editor/editor",
  //             "open": false,
  //         }
  //     ]
  // }
  // , {
  //     "name": "Pages",
  //     "icon": "content_copy",
  //     "open": false,
  //     "link": false,
  //     "sub": [
  //         {
  //             "name": "Login",
  //             "icon": "work",
  //             "open": false,
  //             "link": "../login",
  //         }, {
  //             "name": "Services",
  //             "icon": "local_laundry_service",
  //             "open": false,
  //             "link": "pages/services",
  //         }, {
  //             "name": "Contact",
  //             "icon": "directions",
  //             "open": false,
  //             "link": "pages/contact"
  //         }
  //     ]
  // }
  // , {

  //     "name": "Charts",
  //     "icon": "pie_chart_outlined",
  //     "open": false,
  //     "link": false,
  //     "sub": [
  //         {
  //             "name": "chartjs",
  //             "icon": "view_list",
  //             "link": "charts/chartjs",
  //             "open": false,

  //         },
  //         {
  //             "name": "ngx-chart",
  //             "icon": "show_chart",
  //             "open": false,
  //             "link": "charts/ngx-charts",
  //         },
  //         {
  //             "name": "nvd3",
  //             "icon": "pie_chart",
  //             "open": false,
  //             "link": "charts/nvd3-charts",
  //         }

  //     ]
  // }, {
  //     "name": "maps",
  //     "icon": "map",
  //     "open": false,
  //     "link": false,
  //     "sub": [
  //         {
  //             "name": "google-map",
  //             "icon": "directions",
  //             "link": "maps/googlemap",
  //             "open": false,
  //         },
  //         {
  //             "name": "leaflet-map",
  //             "icon": "directions",
  //             "link": "maps/leafletmap",
  //             "open": false,
  //         }
  //     ]
  // }
];
