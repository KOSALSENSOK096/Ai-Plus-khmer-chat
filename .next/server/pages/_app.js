"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./contexts/LanguageContext.tsx":
/*!**************************************!*\
  !*** ./contexts/LanguageContext.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   LanguageProvider: () => (/* binding */ LanguageProvider),\n/* harmony export */   useLanguage: () => (/* binding */ useLanguage)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n// Code Complete Review: 20240815120000\n\n\n\nconst defaultLanguage = \"en\";\nconst LanguageContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({\n    language: defaultLanguage,\n    setLanguage: ()=>{}\n});\nconst useLanguage = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(LanguageContext);\nconst fetchTranslations = async (language)=>{\n    try {\n        const response = await fetch(`/locales/${language}.json`);\n        if (!response.ok) {\n            throw new Error(`Failed to load ${language} translations: ${response.statusText}`);\n        }\n        return await response.json();\n    } catch (error) {\n        console.error(\"Error fetching translations:\", error);\n        // Fallback to English if the requested language fails to load, and it's not English itself\n        if (language !== \"en\") {\n            try {\n                console.warn(`Falling back to English translations.`);\n                const enResponse = await fetch(`/locales/en.json`);\n                if (!enResponse.ok) {\n                    throw new Error(`Failed to load fallback English translations: ${enResponse.statusText}`);\n                }\n                return await enResponse.json();\n            } catch (fallbackError) {\n                console.error(\"Error fetching fallback English translations:\", fallbackError);\n                return {}; // Return empty if English also fails\n            }\n        }\n        return {}; // Return empty if English fails initially\n    }\n};\nconst LanguageProvider = ({ children })=>{\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    const [language, setLanguage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(defaultLanguage);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const savedLanguage = localStorage.getItem(\"language\") || defaultLanguage;\n        setLanguage(savedLanguage);\n        if (router.locale !== savedLanguage) {\n            router.push(router.pathname, router.asPath, {\n                locale: savedLanguage\n            });\n        }\n    }, []);\n    const handleSetLanguage = (lang)=>{\n        setLanguage(lang);\n        localStorage.setItem(\"language\", lang);\n        router.push(router.pathname, router.asPath, {\n            locale: lang\n        });\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(LanguageContext.Provider, {\n        value: {\n            language,\n            setLanguage: handleSetLanguage\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\KOSALSENSOK\\\\Downloads\\\\ai-plus-khmer-chat\\\\contexts\\\\LanguageContext.tsx\",\n        lineNumber: 71,\n        columnNumber: 5\n    }, undefined);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0cy9MYW5ndWFnZUNvbnRleHQudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsdUNBQXVDOztBQUMrRDtBQUc5RDtBQU94QyxNQUFNTSxrQkFBa0I7QUFFeEIsTUFBTUMsZ0NBQWtCTixvREFBYUEsQ0FBc0I7SUFDekRPLFVBQVVGO0lBQ1ZHLGFBQWEsS0FBTztBQUN0QjtBQUVPLE1BQU1DLGNBQWMsSUFBTU4saURBQVVBLENBQUNHLGlCQUFpQjtBQU03RCxNQUFNSSxvQkFBb0IsT0FBT0g7SUFDL0IsSUFBSTtRQUNGLE1BQU1JLFdBQVcsTUFBTUMsTUFBTSxDQUFDLFNBQVMsRUFBRUwsU0FBUyxLQUFLLENBQUM7UUFDeEQsSUFBSSxDQUFDSSxTQUFTRSxFQUFFLEVBQUU7WUFDaEIsTUFBTSxJQUFJQyxNQUFNLENBQUMsZUFBZSxFQUFFUCxTQUFTLGVBQWUsRUFBRUksU0FBU0ksVUFBVSxDQUFDLENBQUM7UUFDbkY7UUFDQSxPQUFPLE1BQU1KLFNBQVNLLElBQUk7SUFDNUIsRUFBRSxPQUFPQyxPQUFPO1FBQ2RDLFFBQVFELEtBQUssQ0FBQyxnQ0FBZ0NBO1FBQzlDLDJGQUEyRjtRQUMzRixJQUFJVixhQUFhLE1BQU07WUFDckIsSUFBSTtnQkFDRlcsUUFBUUMsSUFBSSxDQUFDLENBQUMscUNBQXFDLENBQUM7Z0JBQ3BELE1BQU1DLGFBQWEsTUFBTVIsTUFBTSxDQUFDLGdCQUFnQixDQUFDO2dCQUNqRCxJQUFJLENBQUNRLFdBQVdQLEVBQUUsRUFBRTtvQkFDbEIsTUFBTSxJQUFJQyxNQUFNLENBQUMsOENBQThDLEVBQUVNLFdBQVdMLFVBQVUsQ0FBQyxDQUFDO2dCQUMxRjtnQkFDQSxPQUFPLE1BQU1LLFdBQVdKLElBQUk7WUFDOUIsRUFBRSxPQUFPSyxlQUFlO2dCQUN0QkgsUUFBUUQsS0FBSyxDQUFDLGlEQUFpREk7Z0JBQy9ELE9BQU8sQ0FBQyxHQUFHLHFDQUFxQztZQUNsRDtRQUNGO1FBQ0EsT0FBTyxDQUFDLEdBQUcsMENBQTBDO0lBQ3ZEO0FBQ0Y7QUFFTyxNQUFNQyxtQkFBbUIsQ0FBQyxFQUFFQyxRQUFRLEVBQXlCO0lBQ2xFLE1BQU1DLFNBQVNwQixzREFBU0E7SUFDeEIsTUFBTSxDQUFDRyxVQUFVQyxZQUFZLEdBQUdQLCtDQUFRQSxDQUFDSTtJQUV6Q0gsZ0RBQVNBLENBQUM7UUFDUixNQUFNdUIsZ0JBQWdCQyxhQUFhQyxPQUFPLENBQUMsZUFBZXRCO1FBQzFERyxZQUFZaUI7UUFDWixJQUFJRCxPQUFPSSxNQUFNLEtBQUtILGVBQWU7WUFDbkNELE9BQU9LLElBQUksQ0FBQ0wsT0FBT00sUUFBUSxFQUFFTixPQUFPTyxNQUFNLEVBQUU7Z0JBQUVILFFBQVFIO1lBQWM7UUFDdEU7SUFDRixHQUFHLEVBQUU7SUFFTCxNQUFNTyxvQkFBb0IsQ0FBQ0M7UUFDekJ6QixZQUFZeUI7UUFDWlAsYUFBYVEsT0FBTyxDQUFDLFlBQVlEO1FBQ2pDVCxPQUFPSyxJQUFJLENBQUNMLE9BQU9NLFFBQVEsRUFBRU4sT0FBT08sTUFBTSxFQUFFO1lBQUVILFFBQVFLO1FBQUs7SUFDN0Q7SUFFQSxxQkFDRSw4REFBQzNCLGdCQUFnQjZCLFFBQVE7UUFBQ0MsT0FBTztZQUFFN0I7WUFBVUMsYUFBYXdCO1FBQWtCO2tCQUN6RVQ7Ozs7OztBQUdQLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9haS1wbHVzLWtobWVyLWNoYXQvLi9jb250ZXh0cy9MYW5ndWFnZUNvbnRleHQudHN4P2YzZjMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29kZSBDb21wbGV0ZSBSZXZpZXc6IDIwMjQwODE1MTIwMDAwXG5pbXBvcnQgUmVhY3QsIHsgY3JlYXRlQ29udGV4dCwgdXNlU3RhdGUsIHVzZUVmZmVjdCwgUmVhY3ROb2RlLCB1c2VDYWxsYmFjaywgdXNlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IExhbmd1YWdlQ29kZSwgVHJhbnNsYXRpb25zIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgQVBQX0xBTkdVQUdFX0tFWSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L3JvdXRlcic7XG5cbnR5cGUgTGFuZ3VhZ2VDb250ZXh0VHlwZSA9IHtcbiAgbGFuZ3VhZ2U6IHN0cmluZztcbiAgc2V0TGFuZ3VhZ2U6IChsYW5nOiBzdHJpbmcpID0+IHZvaWQ7XG59O1xuXG5jb25zdCBkZWZhdWx0TGFuZ3VhZ2UgPSAnZW4nO1xuXG5jb25zdCBMYW5ndWFnZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0PExhbmd1YWdlQ29udGV4dFR5cGU+KHtcbiAgbGFuZ3VhZ2U6IGRlZmF1bHRMYW5ndWFnZSxcbiAgc2V0TGFuZ3VhZ2U6ICgpID0+IHt9LFxufSk7XG5cbmV4cG9ydCBjb25zdCB1c2VMYW5ndWFnZSA9ICgpID0+IHVzZUNvbnRleHQoTGFuZ3VhZ2VDb250ZXh0KTtcblxuaW50ZXJmYWNlIExhbmd1YWdlUHJvdmlkZXJQcm9wcyB7XG4gIGNoaWxkcmVuOiBSZWFjdE5vZGU7XG59XG5cbmNvbnN0IGZldGNoVHJhbnNsYXRpb25zID0gYXN5bmMgKGxhbmd1YWdlOiBMYW5ndWFnZUNvZGUpOiBQcm9taXNlPFRyYW5zbGF0aW9ucz4gPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9sb2NhbGVzLyR7bGFuZ3VhZ2V9Lmpzb25gKTtcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkICR7bGFuZ3VhZ2V9IHRyYW5zbGF0aW9uczogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyB0cmFuc2xhdGlvbnM6XCIsIGVycm9yKTtcbiAgICAvLyBGYWxsYmFjayB0byBFbmdsaXNoIGlmIHRoZSByZXF1ZXN0ZWQgbGFuZ3VhZ2UgZmFpbHMgdG8gbG9hZCwgYW5kIGl0J3Mgbm90IEVuZ2xpc2ggaXRzZWxmXG4gICAgaWYgKGxhbmd1YWdlICE9PSAnZW4nKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zb2xlLndhcm4oYEZhbGxpbmcgYmFjayB0byBFbmdsaXNoIHRyYW5zbGF0aW9ucy5gKTtcbiAgICAgICAgY29uc3QgZW5SZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvbG9jYWxlcy9lbi5qc29uYCk7XG4gICAgICAgIGlmICghZW5SZXNwb25zZS5vaykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGxvYWQgZmFsbGJhY2sgRW5nbGlzaCB0cmFuc2xhdGlvbnM6ICR7ZW5SZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhd2FpdCBlblJlc3BvbnNlLmpzb24oKTtcbiAgICAgIH0gY2F0Y2ggKGZhbGxiYWNrRXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIGZhbGxiYWNrIEVuZ2xpc2ggdHJhbnNsYXRpb25zOlwiLCBmYWxsYmFja0Vycm9yKTtcbiAgICAgICAgcmV0dXJuIHt9OyAvLyBSZXR1cm4gZW1wdHkgaWYgRW5nbGlzaCBhbHNvIGZhaWxzXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7fTsgLy8gUmV0dXJuIGVtcHR5IGlmIEVuZ2xpc2ggZmFpbHMgaW5pdGlhbGx5XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBMYW5ndWFnZVByb3ZpZGVyID0gKHsgY2hpbGRyZW4gfTogTGFuZ3VhZ2VQcm92aWRlclByb3BzKSA9PiB7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xuICBjb25zdCBbbGFuZ3VhZ2UsIHNldExhbmd1YWdlXSA9IHVzZVN0YXRlKGRlZmF1bHRMYW5ndWFnZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzYXZlZExhbmd1YWdlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xhbmd1YWdlJykgfHwgZGVmYXVsdExhbmd1YWdlO1xuICAgIHNldExhbmd1YWdlKHNhdmVkTGFuZ3VhZ2UpO1xuICAgIGlmIChyb3V0ZXIubG9jYWxlICE9PSBzYXZlZExhbmd1YWdlKSB7XG4gICAgICByb3V0ZXIucHVzaChyb3V0ZXIucGF0aG5hbWUsIHJvdXRlci5hc1BhdGgsIHsgbG9jYWxlOiBzYXZlZExhbmd1YWdlIH0pO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIGNvbnN0IGhhbmRsZVNldExhbmd1YWdlID0gKGxhbmc6IHN0cmluZykgPT4ge1xuICAgIHNldExhbmd1YWdlKGxhbmcpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsYW5ndWFnZScsIGxhbmcpO1xuICAgIHJvdXRlci5wdXNoKHJvdXRlci5wYXRobmFtZSwgcm91dGVyLmFzUGF0aCwgeyBsb2NhbGU6IGxhbmcgfSk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8TGFuZ3VhZ2VDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IGxhbmd1YWdlLCBzZXRMYW5ndWFnZTogaGFuZGxlU2V0TGFuZ3VhZ2UgfX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9MYW5ndWFnZUNvbnRleHQuUHJvdmlkZXI+XG4gICk7XG59OyJdLCJuYW1lcyI6WyJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsInVzZUNvbnRleHQiLCJ1c2VSb3V0ZXIiLCJkZWZhdWx0TGFuZ3VhZ2UiLCJMYW5ndWFnZUNvbnRleHQiLCJsYW5ndWFnZSIsInNldExhbmd1YWdlIiwidXNlTGFuZ3VhZ2UiLCJmZXRjaFRyYW5zbGF0aW9ucyIsInJlc3BvbnNlIiwiZmV0Y2giLCJvayIsIkVycm9yIiwic3RhdHVzVGV4dCIsImpzb24iLCJlcnJvciIsImNvbnNvbGUiLCJ3YXJuIiwiZW5SZXNwb25zZSIsImZhbGxiYWNrRXJyb3IiLCJMYW5ndWFnZVByb3ZpZGVyIiwiY2hpbGRyZW4iLCJyb3V0ZXIiLCJzYXZlZExhbmd1YWdlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImxvY2FsZSIsInB1c2giLCJwYXRobmFtZSIsImFzUGF0aCIsImhhbmRsZVNldExhbmd1YWdlIiwibGFuZyIsInNldEl0ZW0iLCJQcm92aWRlciIsInZhbHVlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./contexts/LanguageContext.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_font_google_target_css_path_pages_app_tsx_import_Noto_Sans_arguments_weight_400_700_subsets_latin_variableName_notoSans___WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! next/font/google/target.css?{\"path\":\"pages\\\\_app.tsx\",\"import\":\"Noto_Sans\",\"arguments\":[{\"weight\":[\"400\",\"700\"],\"subsets\":[\"latin\"]}],\"variableName\":\"notoSans\"} */ \"./node_modules/next/font/google/target.css?{\\\"path\\\":\\\"pages\\\\\\\\_app.tsx\\\",\\\"import\\\":\\\"Noto_Sans\\\",\\\"arguments\\\":[{\\\"weight\\\":[\\\"400\\\",\\\"700\\\"],\\\"subsets\\\":[\\\"latin\\\"]}],\\\"variableName\\\":\\\"notoSans\\\"}\");\n/* harmony import */ var next_font_google_target_css_path_pages_app_tsx_import_Noto_Sans_arguments_weight_400_700_subsets_latin_variableName_notoSans___WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(next_font_google_target_css_path_pages_app_tsx_import_Noto_Sans_arguments_weight_400_700_subsets_latin_variableName_notoSans___WEBPACK_IMPORTED_MODULE_9__);\n/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-jsx/style */ \"styled-jsx/style\");\n/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @chakra-ui/react */ \"@chakra-ui/react\");\n/* harmony import */ var next_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next-i18next */ \"next-i18next\");\n/* harmony import */ var next_i18next__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_i18next__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _contexts_LanguageContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../contexts/LanguageContext */ \"./contexts/LanguageContext.tsx\");\n/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../theme */ \"./theme/index.ts\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! next/head */ \"next/head\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_8__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__, _theme__WEBPACK_IMPORTED_MODULE_5__]);\n([_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__, _theme__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_8__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_7__.useEffect)(()=>{\n        // 如果没有指定语言，默认使用英语\n        if (!router.locale) {\n            router.push(router.pathname, router.asPath, {\n                locale: \"en\"\n            });\n        }\n    }, []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_6___default()), {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"title\", {\n                        className: styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default().dynamic([\n                            [\n                                \"e9e5f6d4d0af6565\",\n                                [\n                                    (next_font_google_target_css_path_pages_app_tsx_import_Noto_Sans_arguments_weight_400_700_subsets_latin_variableName_notoSans___WEBPACK_IMPORTED_MODULE_9___default().style).fontFamily\n                                ]\n                            ]\n                        ]),\n                        children: \"AI Plus Khmer Chat\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\KOSALSENSOK\\\\Downloads\\\\ai-plus-khmer-chat\\\\pages\\\\_app.tsx\",\n                        lineNumber: 29,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"description\",\n                        content: \"Experience the power of AI in both English and Khmer\",\n                        className: styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default().dynamic([\n                            [\n                                \"e9e5f6d4d0af6565\",\n                                [\n                                    (next_font_google_target_css_path_pages_app_tsx_import_Noto_Sans_arguments_weight_400_700_subsets_latin_variableName_notoSans___WEBPACK_IMPORTED_MODULE_9___default().style).fontFamily\n                                ]\n                            ]\n                        ])\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\KOSALSENSOK\\\\Downloads\\\\ai-plus-khmer-chat\\\\pages\\\\_app.tsx\",\n                        lineNumber: 30,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        href: \"https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;700&display=swap\",\n                        rel: \"stylesheet\",\n                        className: styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default().dynamic([\n                            [\n                                \"e9e5f6d4d0af6565\",\n                                [\n                                    (next_font_google_target_css_path_pages_app_tsx_import_Noto_Sans_arguments_weight_400_700_subsets_latin_variableName_notoSans___WEBPACK_IMPORTED_MODULE_9___default().style).fontFamily\n                                ]\n                            ]\n                        ])\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\KOSALSENSOK\\\\Downloads\\\\ai-plus-khmer-chat\\\\pages\\\\_app.tsx\",\n                        lineNumber: 31,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\KOSALSENSOK\\\\Downloads\\\\ai-plus-khmer-chat\\\\pages\\\\_app.tsx\",\n                lineNumber: 28,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {\n                id: \"e9e5f6d4d0af6565\",\n                dynamic: [\n                    (next_font_google_target_css_path_pages_app_tsx_import_Noto_Sans_arguments_weight_400_700_subsets_latin_variableName_notoSans___WEBPACK_IMPORTED_MODULE_9___default().style).fontFamily\n                ],\n                children: `:root{--font-noto-sans:${(next_font_google_target_css_path_pages_app_tsx_import_Noto_Sans_arguments_weight_400_700_subsets_latin_variableName_notoSans___WEBPACK_IMPORTED_MODULE_9___default().style).fontFamily}}`\n            }, void 0, false, void 0, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__.ChakraProvider, {\n                theme: _theme__WEBPACK_IMPORTED_MODULE_5__[\"default\"],\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_LanguageContext__WEBPACK_IMPORTED_MODULE_4__.LanguageProvider, {\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                        ...pageProps,\n                        className: styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default().dynamic([\n                            [\n                                \"e9e5f6d4d0af6565\",\n                                [\n                                    (next_font_google_target_css_path_pages_app_tsx_import_Noto_Sans_arguments_weight_400_700_subsets_latin_variableName_notoSans___WEBPACK_IMPORTED_MODULE_9___default().style).fontFamily\n                                ]\n                            ]\n                        ]) + \" \" + (pageProps && pageProps.className != null && pageProps.className || \"\")\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\KOSALSENSOK\\\\Downloads\\\\ai-plus-khmer-chat\\\\pages\\\\_app.tsx\",\n                        lineNumber: 43,\n                        columnNumber: 11\n                    }, this)\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\KOSALSENSOK\\\\Downloads\\\\ai-plus-khmer-chat\\\\pages\\\\_app.tsx\",\n                    lineNumber: 42,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\KOSALSENSOK\\\\Downloads\\\\ai-plus-khmer-chat\\\\pages\\\\_app.tsx\",\n                lineNumber: 41,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_i18next__WEBPACK_IMPORTED_MODULE_3__.appWithTranslation)(MyApp));\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBVU1BOztBQVQ0QztBQUNBO0FBQ2E7QUFDbEM7QUFFQTtBQUNLO0FBQ007QUFPeEMsU0FBU1EsTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUMvQyxNQUFNQyxTQUFTSixzREFBU0E7SUFFeEJELGdEQUFTQSxDQUFDO1FBQ1Isa0JBQWtCO1FBQ2xCLElBQUksQ0FBQ0ssT0FBT0MsTUFBTSxFQUFFO1lBQ2xCRCxPQUFPRSxJQUFJLENBQUNGLE9BQU9HLFFBQVEsRUFBRUgsT0FBT0ksTUFBTSxFQUFFO2dCQUFFSCxRQUFRO1lBQUs7UUFDN0Q7SUFDRixHQUFHLEVBQUU7SUFFTCxxQkFDRTs7MEJBQ0UsOERBQUNQLGtEQUFJQTs7a0NBQ0gsOERBQUNXOzs7OztvQ0FTcUJoQiw0S0FBYyxDQUFDa0IsVUFBVTs7OztrQ0FUeEM7Ozs7OztrQ0FDUCw4REFBQ0M7d0JBQUtDLE1BQUs7d0JBQWNDLFNBQVE7Ozs7O29DQVFYckIsNEtBQWMsQ0FBQ2tCLFVBQVU7Ozs7Ozs7OztrQ0FQL0MsOERBQUNJO3dCQUNDQyxNQUFLO3dCQUNMQyxLQUFJOzs7OztvQ0FLZ0J4Qiw0S0FBYyxDQUFDa0IsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUF6QmxCLDRLQUFjLENBQUNrQixVQUFVOztvREFBekJsQiw0S0FBYyxDQUFDa0IsVUFBVTs7MEJBR2pELDhEQUFDakIsNERBQWNBO2dCQUFDRyxPQUFPQSw4Q0FBS0E7MEJBQzFCLDRFQUFDRCx1RUFBZ0JBOzhCQUNmLDRFQUFDTTt3QkFBVyxHQUFHQyxTQUFTOzs7OztvQ0FMSlYsNEtBQWMsQ0FBQ2tCLFVBQVU7OztvQ0FLOUJSLGFBQUFBLCtCQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS3pCO0FBRUEsaUVBQWVSLGdFQUFrQkEsQ0FBQ00sTUFBTUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2FpLXBsdXMta2htZXItY2hhdC8uL3BhZ2VzL19hcHAudHN4PzJmYmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCc7XHJcbmltcG9ydCB7IENoYWtyYVByb3ZpZGVyIH0gZnJvbSAnQGNoYWtyYS11aS9yZWFjdCc7XHJcbmltcG9ydCB7IGFwcFdpdGhUcmFuc2xhdGlvbiB9IGZyb20gJ25leHQtaTE4bmV4dCc7XHJcbmltcG9ydCB7IExhbmd1YWdlUHJvdmlkZXIgfSBmcm9tICcuLi9jb250ZXh0cy9MYW5ndWFnZUNvbnRleHQnO1xyXG5pbXBvcnQgdGhlbWUgZnJvbSAnLi4vdGhlbWUnO1xyXG5pbXBvcnQgeyBOb3RvX1NhbnMgfSBmcm9tICduZXh0L2ZvbnQvZ29vZ2xlJztcclxuaW1wb3J0IEhlYWQgZnJvbSAnbmV4dC9oZWFkJztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L3JvdXRlcic7XHJcblxyXG5jb25zdCBub3RvU2FucyA9IE5vdG9fU2Fucyh7XHJcbiAgd2VpZ2h0OiBbJzQwMCcsICc3MDAnXSxcclxuICBzdWJzZXRzOiBbJ2xhdGluJ10sXHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xyXG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgLy8g5aaC5p6c5rKh5pyJ5oyH5a6a6K+t6KiA77yM6buY6K6k5L2/55So6Iux6K+tXHJcbiAgICBpZiAoIXJvdXRlci5sb2NhbGUpIHtcclxuICAgICAgcm91dGVyLnB1c2gocm91dGVyLnBhdGhuYW1lLCByb3V0ZXIuYXNQYXRoLCB7IGxvY2FsZTogJ2VuJyB9KTtcclxuICAgIH1cclxuICB9LCBbXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8PlxyXG4gICAgICA8SGVhZD5cclxuICAgICAgICA8dGl0bGU+QUkgUGx1cyBLaG1lciBDaGF0PC90aXRsZT5cclxuICAgICAgICA8bWV0YSBuYW1lPVwiZGVzY3JpcHRpb25cIiBjb250ZW50PVwiRXhwZXJpZW5jZSB0aGUgcG93ZXIgb2YgQUkgaW4gYm90aCBFbmdsaXNoIGFuZCBLaG1lclwiIC8+XHJcbiAgICAgICAgPGxpbmtcclxuICAgICAgICAgIGhyZWY9XCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PU5vdG8rU2FucytLaG1lcjp3Z2h0QDQwMDs3MDAmZGlzcGxheT1zd2FwXCJcclxuICAgICAgICAgIHJlbD1cInN0eWxlc2hlZXRcIlxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvSGVhZD5cclxuICAgICAgPHN0eWxlIGpzeCBnbG9iYWw+e2BcclxuICAgICAgICA6cm9vdCB7XHJcbiAgICAgICAgICAtLWZvbnQtbm90by1zYW5zOiAke25vdG9TYW5zLnN0eWxlLmZvbnRGYW1pbHl9O1xyXG4gICAgICAgIH1cclxuICAgICAgYH08L3N0eWxlPlxyXG4gICAgICA8Q2hha3JhUHJvdmlkZXIgdGhlbWU9e3RoZW1lfT5cclxuICAgICAgICA8TGFuZ3VhZ2VQcm92aWRlcj5cclxuICAgICAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuICAgICAgICA8L0xhbmd1YWdlUHJvdmlkZXI+XHJcbiAgICAgIDwvQ2hha3JhUHJvdmlkZXI+XHJcbiAgICA8Lz5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhcHBXaXRoVHJhbnNsYXRpb24oTXlBcHApOyAiXSwibmFtZXMiOlsibm90b1NhbnMiLCJDaGFrcmFQcm92aWRlciIsImFwcFdpdGhUcmFuc2xhdGlvbiIsIkxhbmd1YWdlUHJvdmlkZXIiLCJ0aGVtZSIsIkhlYWQiLCJ1c2VFZmZlY3QiLCJ1c2VSb3V0ZXIiLCJNeUFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsInJvdXRlciIsImxvY2FsZSIsInB1c2giLCJwYXRobmFtZSIsImFzUGF0aCIsInRpdGxlIiwic3R5bGUiLCJmb250RmFtaWx5IiwibWV0YSIsIm5hbWUiLCJjb250ZW50IiwibGluayIsImhyZWYiLCJyZWwiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./theme/index.ts":
/*!************************!*\
  !*** ./theme/index.ts ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @chakra-ui/react */ \"@chakra-ui/react\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__]);\n_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nconst config = {\n    initialColorMode: \"light\",\n    useSystemColorMode: true\n};\nconst theme = (0,_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.extendTheme)({\n    config,\n    fonts: {\n        heading: `'Noto Sans', sans-serif`,\n        body: `'Noto Sans', sans-serif`\n    },\n    colors: {\n        brand: {\n            50: \"#E6FFFA\",\n            100: \"#B2F5EA\",\n            200: \"#81E6D9\",\n            300: \"#4FD1C5\",\n            400: \"#38B2AC\",\n            500: \"#319795\",\n            600: \"#2C7A7B\",\n            700: \"#285E61\",\n            800: \"#234E52\",\n            900: \"#1D4044\"\n        }\n    },\n    components: {\n        Button: {\n            defaultProps: {\n                colorScheme: \"teal\"\n            }\n        },\n        Heading: {\n            baseStyle: {\n                fontWeight: \"bold\",\n                letterSpacing: \"-0.02em\"\n            }\n        }\n    },\n    styles: {\n        global: {\n            body: {\n                bg: \"gray.50\",\n                color: \"gray.800\"\n            }\n        }\n    }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (theme);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi90aGVtZS9pbmRleC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFpRTtBQUVqRSxNQUFNQyxTQUFzQjtJQUMxQkMsa0JBQWtCO0lBQ2xCQyxvQkFBb0I7QUFDdEI7QUFFQSxNQUFNQyxRQUFRSiw2REFBV0EsQ0FBQztJQUN4QkM7SUFDQUksT0FBTztRQUNMQyxTQUFTLENBQUMsdUJBQXVCLENBQUM7UUFDbENDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQztJQUNqQztJQUNBQyxRQUFRO1FBQ05DLE9BQU87WUFDTCxJQUFJO1lBQ0osS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1FBQ1A7SUFDRjtJQUNBQyxZQUFZO1FBQ1ZDLFFBQVE7WUFDTkMsY0FBYztnQkFDWkMsYUFBYTtZQUNmO1FBQ0Y7UUFDQUMsU0FBUztZQUNQQyxXQUFXO2dCQUNUQyxZQUFZO2dCQUNaQyxlQUFlO1lBQ2pCO1FBQ0Y7SUFDRjtJQUNBQyxRQUFRO1FBQ05DLFFBQVE7WUFDTlosTUFBTTtnQkFDSmEsSUFBSTtnQkFDSkMsT0FBTztZQUNUO1FBQ0Y7SUFDRjtBQUNGO0FBRUEsaUVBQWVqQixLQUFLQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYWktcGx1cy1raG1lci1jaGF0Ly4vdGhlbWUvaW5kZXgudHM/YzgwOSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleHRlbmRUaGVtZSwgdHlwZSBUaGVtZUNvbmZpZyB9IGZyb20gJ0BjaGFrcmEtdWkvcmVhY3QnO1xyXG5cclxuY29uc3QgY29uZmlnOiBUaGVtZUNvbmZpZyA9IHtcclxuICBpbml0aWFsQ29sb3JNb2RlOiAnbGlnaHQnLFxyXG4gIHVzZVN5c3RlbUNvbG9yTW9kZTogdHJ1ZSxcclxufTtcclxuXHJcbmNvbnN0IHRoZW1lID0gZXh0ZW5kVGhlbWUoe1xyXG4gIGNvbmZpZyxcclxuICBmb250czoge1xyXG4gICAgaGVhZGluZzogYCdOb3RvIFNhbnMnLCBzYW5zLXNlcmlmYCxcclxuICAgIGJvZHk6IGAnTm90byBTYW5zJywgc2Fucy1zZXJpZmAsXHJcbiAgfSxcclxuICBjb2xvcnM6IHtcclxuICAgIGJyYW5kOiB7XHJcbiAgICAgIDUwOiAnI0U2RkZGQScsXHJcbiAgICAgIDEwMDogJyNCMkY1RUEnLFxyXG4gICAgICAyMDA6ICcjODFFNkQ5JyxcclxuICAgICAgMzAwOiAnIzRGRDFDNScsXHJcbiAgICAgIDQwMDogJyMzOEIyQUMnLFxyXG4gICAgICA1MDA6ICcjMzE5Nzk1JyxcclxuICAgICAgNjAwOiAnIzJDN0E3QicsXHJcbiAgICAgIDcwMDogJyMyODVFNjEnLFxyXG4gICAgICA4MDA6ICcjMjM0RTUyJyxcclxuICAgICAgOTAwOiAnIzFENDA0NCcsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcG9uZW50czoge1xyXG4gICAgQnV0dG9uOiB7XHJcbiAgICAgIGRlZmF1bHRQcm9wczoge1xyXG4gICAgICAgIGNvbG9yU2NoZW1lOiAndGVhbCcsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgSGVhZGluZzoge1xyXG4gICAgICBiYXNlU3R5bGU6IHtcclxuICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXHJcbiAgICAgICAgbGV0dGVyU3BhY2luZzogJy0wLjAyZW0nLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHN0eWxlczoge1xyXG4gICAgZ2xvYmFsOiB7XHJcbiAgICAgIGJvZHk6IHtcclxuICAgICAgICBiZzogJ2dyYXkuNTAnLFxyXG4gICAgICAgIGNvbG9yOiAnZ3JheS44MDAnLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRoZW1lOyAiXSwibmFtZXMiOlsiZXh0ZW5kVGhlbWUiLCJjb25maWciLCJpbml0aWFsQ29sb3JNb2RlIiwidXNlU3lzdGVtQ29sb3JNb2RlIiwidGhlbWUiLCJmb250cyIsImhlYWRpbmciLCJib2R5IiwiY29sb3JzIiwiYnJhbmQiLCJjb21wb25lbnRzIiwiQnV0dG9uIiwiZGVmYXVsdFByb3BzIiwiY29sb3JTY2hlbWUiLCJIZWFkaW5nIiwiYmFzZVN0eWxlIiwiZm9udFdlaWdodCIsImxldHRlclNwYWNpbmciLCJzdHlsZXMiLCJnbG9iYWwiLCJiZyIsImNvbG9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./theme/index.ts\n");

/***/ }),

/***/ "next-i18next":
/*!*******************************!*\
  !*** external "next-i18next" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("next-i18next");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("next/head");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "styled-jsx/style":
/*!***********************************!*\
  !*** external "styled-jsx/style" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("styled-jsx/style");

/***/ }),

/***/ "@chakra-ui/react":
/*!***********************************!*\
  !*** external "@chakra-ui/react" ***!
  \***********************************/
/***/ ((module) => {

module.exports = import("@chakra-ui/react");;

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();