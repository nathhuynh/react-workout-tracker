"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/_app",{

/***/ "./components/Sidebar.tsx":
/*!********************************!*\
  !*** ./components/Sidebar.tsx ***!
  \********************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/link */ \"./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n\nvar _s = $RefreshSig$();\n\n\n\nconst Sidebar = (param)=>{\n    let { isSidebarCollapsed, setIsSidebarCollapsed } = param;\n    _s();\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    const currentRoute = router.pathname;\n    const handleLinkClick = (href)=>{\n        setIsSidebarCollapsed(true);\n        router.push(href);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            !isSidebarCollapsed && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40\",\n                onClick: ()=>setIsSidebarCollapsed(true)\n            }, void 0, false, {\n                fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                lineNumber: 23,\n                columnNumber: 9\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 z-50 \".concat(isSidebarCollapsed ? \"-translate-x-full\" : \"translate-x-0\", \" w-64\"),\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"aside\", {\n                    className: \"flex flex-col h-full\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"px-4 py-2 bg-gray-800 flex items-center justify-between\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                                        className: \"text-2xl font-bold text-right\",\n                                        children: \"RP\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                        lineNumber: 38,\n                                        columnNumber: 15\n                                    }, undefined),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                        className: \"text-sm\",\n                                        children: \"Hypertrophy Beta\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                        lineNumber: 39,\n                                        columnNumber: 15\n                                    }, undefined)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                lineNumber: 37,\n                                columnNumber: 13\n                            }, undefined)\n                        }, void 0, false, {\n                            fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                            lineNumber: 36,\n                            columnNumber: 11\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n                            className: \"flex-1 px-2 py-4 overflow-y-auto\",\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                    href: \"/workout\",\n                                    passHref: true,\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"block px-2 py-2 text-sm font-semibold rounded cursor-pointer \".concat(currentRoute === \"/workout\" ? \"bg-gray-700\" : \"\"),\n                                        children: \"Current workout\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                        lineNumber: 44,\n                                        columnNumber: 15\n                                    }, undefined)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                    lineNumber: 43,\n                                    columnNumber: 13\n                                }, undefined),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                    href: \"/mesocycles\",\n                                    passHref: true,\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"block px-2 py-2 text-sm cursor-pointer \".concat(currentRoute === \"/mesocycles\" ? \"bg-gray-700\" : \"\"),\n                                        children: \"Mesocycles\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                        lineNumber: 47,\n                                        columnNumber: 15\n                                    }, undefined)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                    lineNumber: 46,\n                                    columnNumber: 13\n                                }, undefined),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                    href: \"/templates\",\n                                    passHref: true,\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"block px-2 py-2 text-sm cursor-pointer \".concat(currentRoute === \"/templates\" ? \"bg-gray-700\" : \"\"),\n                                        children: \"Templates\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                        lineNumber: 50,\n                                        columnNumber: 15\n                                    }, undefined)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                    lineNumber: 49,\n                                    columnNumber: 13\n                                }, undefined),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                    href: \"/addcustomexercise\",\n                                    passHref: true,\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"block px-2 py-2 text-sm cursor-pointer \".concat(currentRoute === \"/addcustomexercise\" ? \"bg-gray-700\" : \"\"),\n                                        children: \"Custom exercises\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                        lineNumber: 53,\n                                        columnNumber: 15\n                                    }, undefined)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                    lineNumber: 52,\n                                    columnNumber: 13\n                                }, undefined),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                    href: \"/new-mesocycle\",\n                                    passHref: true,\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"block px-2 py-2 text-sm cursor-pointer \".concat(currentRoute === \"/new-mesocycle\" ? \"bg-gray-700\" : \"\"),\n                                        children: \"Plan a new mesocycle\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                        lineNumber: 56,\n                                        columnNumber: 15\n                                    }, undefined)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                    lineNumber: 55,\n                                    columnNumber: 13\n                                }, undefined)\n                            ]\n                        }, void 0, true, {\n                            fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                            lineNumber: 42,\n                            columnNumber: 11\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"px-2 py-4 bg-gray-800\",\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                    href: \"/light-theme\",\n                                    passHref: true,\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"block px-2 py-2 text-sm cursor-pointer \".concat(currentRoute === \"/light-theme\" ? \"bg-gray-700\" : \"\"),\n                                        children: \"Light Theme\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                        lineNumber: 61,\n                                        columnNumber: 15\n                                    }, undefined)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                    lineNumber: 60,\n                                    columnNumber: 13\n                                }, undefined),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                    href: \"/profile\",\n                                    passHref: true,\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"block px-2 py-2 text-sm cursor-pointer \".concat(currentRoute === \"/profile\" ? \"bg-gray-700\" : \"\"),\n                                        children: \"Profile\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                        lineNumber: 64,\n                                        columnNumber: 15\n                                    }, undefined)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                    lineNumber: 63,\n                                    columnNumber: 13\n                                }, undefined),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                    href: \"/subscription\",\n                                    passHref: true,\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"block px-2 py-2 text-sm cursor-pointer \".concat(currentRoute === \"/subscription\" ? \"bg-gray-700\" : \"\"),\n                                        children: \"Subscription\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                        lineNumber: 67,\n                                        columnNumber: 15\n                                    }, undefined)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                    lineNumber: 66,\n                                    columnNumber: 13\n                                }, undefined),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                    href: \"/sign-out\",\n                                    passHref: true,\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"block px-2 py-2 text-sm cursor-pointer \".concat(currentRoute === \"/sign-out\" ? \"bg-gray-700\" : \"\"),\n                                        children: \"Sign out\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                        lineNumber: 70,\n                                        columnNumber: 15\n                                    }, undefined)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                    lineNumber: 69,\n                                    columnNumber: 13\n                                }, undefined),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                    href: \"/help\",\n                                    passHref: true,\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"block px-2 py-2 text-sm cursor-pointer \".concat(currentRoute === \"/help\" ? \"bg-gray-700\" : \"\"),\n                                        children: \"Help\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                        lineNumber: 73,\n                                        columnNumber: 15\n                                    }, undefined)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                    lineNumber: 72,\n                                    columnNumber: 13\n                                }, undefined),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                    href: \"/review\",\n                                    passHref: true,\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"block px-2 py-2 text-sm cursor-pointer \".concat(currentRoute === \"/review\" ? \"bg-gray-700\" : \"\"),\n                                        children: \"Leave a review\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                        lineNumber: 76,\n                                        columnNumber: 15\n                                    }, undefined)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                                    lineNumber: 75,\n                                    columnNumber: 13\n                                }, undefined)\n                            ]\n                        }, void 0, true, {\n                            fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                            lineNumber: 59,\n                            columnNumber: 11\n                        }, undefined)\n                    ]\n                }, void 0, true, {\n                    fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                    lineNumber: 35,\n                    columnNumber: 9\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                lineNumber: 30,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                onClick: ()=>setIsSidebarCollapsed(!isSidebarCollapsed),\n                className: \"fixed top-4 left-4 bg-gray-700 text-white px-2 py-1 rounded z-50\",\n                children: isSidebarCollapsed ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"i\", {\n                    className: \"fas fa-chevron-right\"\n                }, void 0, false, {\n                    fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                    lineNumber: 88,\n                    columnNumber: 11\n                }, undefined) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"i\", {\n                    className: \"fas fa-chevron-left\"\n                }, void 0, false, {\n                    fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                    lineNumber: 90,\n                    columnNumber: 11\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"C:\\\\react-gym-app\\\\gym-tracker\\\\react-gym-tracker\\\\components\\\\Sidebar.tsx\",\n                lineNumber: 83,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true);\n};\n_s(Sidebar, \"fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=\", false, function() {\n    return [\n        next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter\n    ];\n});\n_c = Sidebar;\n/* harmony default export */ __webpack_exports__[\"default\"] = (Sidebar);\nvar _c;\n$RefreshReg$(_c, \"Sidebar\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFnQjtrREFBTTs7Ozs7Ozs7Ozs7OENBRTdHLDhEQUFDTixrREFBSUE7b0NBQUNTLE1BQUs7b0NBQVVTLFFBQVE7OENBQzNCLDRFQUFDUDt3Q0FBSUMsV0FBVywwQ0FBMEYsT0FBaEROLGlCQUFpQixZQUFZLGdCQUFnQjtrREFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQkFPckgsOERBQUNhO2dCQUNDTixTQUFTLElBQU1ULHNCQUFzQixDQUFDRDtnQkFDdENTLFdBQVU7MEJBRVRULG1DQUNDLDhEQUFDaUI7b0JBQUVSLFdBQVU7Ozs7OzhDQUViLDhEQUFDUTtvQkFBRVIsV0FBVTs7Ozs7Ozs7Ozs7OztBQUt2QjtHQXJGTVY7O1FBQ1dELGtEQUFTQTs7O0tBRHBCQztBQXVGTiwrREFBZUEsT0FBT0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9jb21wb25lbnRzL1NpZGViYXIudHN4PzZiYTkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IExpbmsgZnJvbSAnbmV4dC9saW5rJztcclxuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9yb3V0ZXInO1xyXG5cclxuaW50ZXJmYWNlIFNpZGViYXJQcm9wcyB7XHJcbiAgaXNTaWRlYmFyQ29sbGFwc2VkOiBib29sZWFuO1xyXG4gIHNldElzU2lkZWJhckNvbGxhcHNlZDogKGlzQ29sbGFwc2VkOiBib29sZWFuKSA9PiB2b2lkO1xyXG59XHJcblxyXG5jb25zdCBTaWRlYmFyOiBSZWFjdC5GQzxTaWRlYmFyUHJvcHM+ID0gKHsgaXNTaWRlYmFyQ29sbGFwc2VkLCBzZXRJc1NpZGViYXJDb2xsYXBzZWQgfSkgPT4ge1xyXG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xyXG4gIGNvbnN0IGN1cnJlbnRSb3V0ZSA9IHJvdXRlci5wYXRobmFtZTtcclxuICBcclxuICBjb25zdCBoYW5kbGVMaW5rQ2xpY2sgPSAoaHJlZjogc3RyaW5nKSA9PiB7XHJcbiAgICBzZXRJc1NpZGViYXJDb2xsYXBzZWQodHJ1ZSk7XHJcbiAgICByb3V0ZXIucHVzaChocmVmKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8PlxyXG4gICAgICB7LyogT3ZlcmxheSAqL31cclxuICAgICAgeyFpc1NpZGViYXJDb2xsYXBzZWQgJiYgKFxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgIGNsYXNzTmFtZT1cImZpeGVkIGluc2V0LTAgYmctYmxhY2sgYmctb3BhY2l0eS01MCBiYWNrZHJvcC1ibHVyLXNtIHotNDBcIlxyXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNTaWRlYmFyQ29sbGFwc2VkKHRydWUpfVxyXG4gICAgICAgID48L2Rpdj5cclxuICAgICAgKX1cclxuXHJcbiAgICAgIHsvKiBTaWRlYmFyICovfVxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgY2xhc3NOYW1lPXtgZml4ZWQgdG9wLTAgbGVmdC0wIGgtZnVsbCBiZy1ncmF5LTkwMCB0ZXh0LXdoaXRlIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTMwMCB6LTUwICR7XHJcbiAgICAgICAgICBpc1NpZGViYXJDb2xsYXBzZWQgPyAnLXRyYW5zbGF0ZS14LWZ1bGwnIDogJ3RyYW5zbGF0ZS14LTAnXHJcbiAgICAgICAgfSB3LTY0YH1cclxuICAgICAgPlxyXG4gICAgICAgIDxhc2lkZSBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGgtZnVsbFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC00IHB5LTIgYmctZ3JheS04MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCB0ZXh0LXJpZ2h0XCI+UlA8L2gxPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc21cIj5IeXBlcnRyb3BoeSBCZXRhPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPG5hdiBjbGFzc05hbWU9XCJmbGV4LTEgcHgtMiBweS00IG92ZXJmbG93LXktYXV0b1wiPlxyXG4gICAgICAgICAgICA8TGluayBocmVmPVwiL3dvcmtvdXRcIiBwYXNzSHJlZj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGJsb2NrIHB4LTIgcHktMiB0ZXh0LXNtIGZvbnQtc2VtaWJvbGQgcm91bmRlZCBjdXJzb3ItcG9pbnRlciAke2N1cnJlbnRSb3V0ZSA9PT0gJy93b3Jrb3V0JyA/ICdiZy1ncmF5LTcwMCcgOiAnJ31gfT5DdXJyZW50IHdvcmtvdXQ8L2Rpdj5cclxuICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICA8TGluayBocmVmPVwiL21lc29jeWNsZXNcIiBwYXNzSHJlZj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGJsb2NrIHB4LTIgcHktMiB0ZXh0LXNtIGN1cnNvci1wb2ludGVyICR7Y3VycmVudFJvdXRlID09PSAnL21lc29jeWNsZXMnID8gJ2JnLWdyYXktNzAwJyA6ICcnfWB9Pk1lc29jeWNsZXM8L2Rpdj5cclxuICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICA8TGluayBocmVmPVwiL3RlbXBsYXRlc1wiIHBhc3NIcmVmPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgYmxvY2sgcHgtMiBweS0yIHRleHQtc20gY3Vyc29yLXBvaW50ZXIgJHtjdXJyZW50Um91dGUgPT09ICcvdGVtcGxhdGVzJyA/ICdiZy1ncmF5LTcwMCcgOiAnJ31gfT5UZW1wbGF0ZXM8L2Rpdj5cclxuICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICA8TGluayBocmVmPVwiL2FkZGN1c3RvbWV4ZXJjaXNlXCIgcGFzc0hyZWY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BibG9jayBweC0yIHB5LTIgdGV4dC1zbSBjdXJzb3ItcG9pbnRlciAke2N1cnJlbnRSb3V0ZSA9PT0gJy9hZGRjdXN0b21leGVyY2lzZScgPyAnYmctZ3JheS03MDAnIDogJyd9YH0+Q3VzdG9tIGV4ZXJjaXNlczwvZGl2PlxyXG4gICAgICAgICAgICA8L0xpbms+XHJcbiAgICAgICAgICAgIDxMaW5rIGhyZWY9XCIvbmV3LW1lc29jeWNsZVwiIHBhc3NIcmVmPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgYmxvY2sgcHgtMiBweS0yIHRleHQtc20gY3Vyc29yLXBvaW50ZXIgJHtjdXJyZW50Um91dGUgPT09ICcvbmV3LW1lc29jeWNsZScgPyAnYmctZ3JheS03MDAnIDogJyd9YH0+UGxhbiBhIG5ldyBtZXNvY3ljbGU8L2Rpdj5cclxuICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgPC9uYXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTIgcHktNCBiZy1ncmF5LTgwMFwiPlxyXG4gICAgICAgICAgICA8TGluayBocmVmPVwiL2xpZ2h0LXRoZW1lXCIgcGFzc0hyZWY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BibG9jayBweC0yIHB5LTIgdGV4dC1zbSBjdXJzb3ItcG9pbnRlciAke2N1cnJlbnRSb3V0ZSA9PT0gJy9saWdodC10aGVtZScgPyAnYmctZ3JheS03MDAnIDogJyd9YH0+TGlnaHQgVGhlbWU8L2Rpdj5cclxuICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICA8TGluayBocmVmPVwiL3Byb2ZpbGVcIiBwYXNzSHJlZj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGJsb2NrIHB4LTIgcHktMiB0ZXh0LXNtIGN1cnNvci1wb2ludGVyICR7Y3VycmVudFJvdXRlID09PSAnL3Byb2ZpbGUnID8gJ2JnLWdyYXktNzAwJyA6ICcnfWB9PlByb2ZpbGU8L2Rpdj5cclxuICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICA8TGluayBocmVmPVwiL3N1YnNjcmlwdGlvblwiIHBhc3NIcmVmPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgYmxvY2sgcHgtMiBweS0yIHRleHQtc20gY3Vyc29yLXBvaW50ZXIgJHtjdXJyZW50Um91dGUgPT09ICcvc3Vic2NyaXB0aW9uJyA/ICdiZy1ncmF5LTcwMCcgOiAnJ31gfT5TdWJzY3JpcHRpb248L2Rpdj5cclxuICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICA8TGluayBocmVmPVwiL3NpZ24tb3V0XCIgcGFzc0hyZWY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BibG9jayBweC0yIHB5LTIgdGV4dC1zbSBjdXJzb3ItcG9pbnRlciAke2N1cnJlbnRSb3V0ZSA9PT0gJy9zaWduLW91dCcgPyAnYmctZ3JheS03MDAnIDogJyd9YH0+U2lnbiBvdXQ8L2Rpdj5cclxuICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICA8TGluayBocmVmPVwiL2hlbHBcIiBwYXNzSHJlZj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGJsb2NrIHB4LTIgcHktMiB0ZXh0LXNtIGN1cnNvci1wb2ludGVyICR7Y3VycmVudFJvdXRlID09PSAnL2hlbHAnID8gJ2JnLWdyYXktNzAwJyA6ICcnfWB9PkhlbHA8L2Rpdj5cclxuICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgICA8TGluayBocmVmPVwiL3Jldmlld1wiIHBhc3NIcmVmPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgYmxvY2sgcHgtMiBweS0yIHRleHQtc20gY3Vyc29yLXBvaW50ZXIgJHtjdXJyZW50Um91dGUgPT09ICcvcmV2aWV3JyA/ICdiZy1ncmF5LTcwMCcgOiAnJ31gfT5MZWF2ZSBhIHJldmlldzwvZGl2PlxyXG4gICAgICAgICAgICA8L0xpbms+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2FzaWRlPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHsvKiBUb2dnbGUgYnV0dG9uICovfVxyXG4gICAgICA8YnV0dG9uXHJcbiAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNTaWRlYmFyQ29sbGFwc2VkKCFpc1NpZGViYXJDb2xsYXBzZWQpfVxyXG4gICAgICAgIGNsYXNzTmFtZT1cImZpeGVkIHRvcC00IGxlZnQtNCBiZy1ncmF5LTcwMCB0ZXh0LXdoaXRlIHB4LTIgcHktMSByb3VuZGVkIHotNTBcIlxyXG4gICAgICA+XHJcbiAgICAgICAge2lzU2lkZWJhckNvbGxhcHNlZCA/IChcclxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhcyBmYS1jaGV2cm9uLXJpZ2h0XCI+PC9pPlxyXG4gICAgICAgICkgOiAoXHJcbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYXMgZmEtY2hldnJvbi1sZWZ0XCI+PC9pPlxyXG4gICAgICAgICl9XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgPC8+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNpZGViYXI7Il0sIm5hbWVzIjpbIlJlYWN0IiwiTGluayIsInVzZVJvdXRlciIsIlNpZGViYXIiLCJpc1NpZGViYXJDb2xsYXBzZWQiLCJzZXRJc1NpZGViYXJDb2xsYXBzZWQiLCJyb3V0ZXIiLCJjdXJyZW50Um91dGUiLCJwYXRobmFtZSIsImhhbmRsZUxpbmtDbGljayIsImhyZWYiLCJwdXNoIiwiZGl2IiwiY2xhc3NOYW1lIiwib25DbGljayIsImFzaWRlIiwiaDEiLCJzcGFuIiwibmF2IiwicGFzc0hyZWYiLCJidXR0b24iLCJpIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./components/Sidebar.tsx\n"));

/***/ })

});