// ==UserScript==
// @name         WEB 中文汉化插件 - CDN
// @name:en-US   WEB Chinese Translation Plugin - CDN
// @namespace    https://github.com/Qing90bing/Qing_Web-Translate-Script
// @version      1.0.0-2025-09-27-cdn
// @description  人工翻译一些网站为中文，减少阅读压力,该版本使用的是CDN，自动更新:)
// @description:en-US   Translate some websites into Chinese to reduce reading pressure, this version uses CDN, automatically updated :)
// @license      MIT
// @copyright    2025, Qing90bing
// @author       Qing90bing
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiID8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+Cjxzdmcgd2lkdGg9IjcwNnB0IiBoZWlnaHQ9IjcwN3B0IiB2aWV3Qm94PSIwIDAgNzA2IDcwNyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBpZD0iIzExN2ZlOWZmIj4KPHBhdGggZmlsbD0iIzExN2ZlOSIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gMTg3LjQ3IDAuMDAgTCA1MTguNTMgMC4wMCBDIDU1NC4xOSAzLjEwIDU4OS40OSAxNC40MyA2MTguODkgMzUuMTMgQyA2NDYuOTMgNTQuMjMgNjcwLjA2IDgwLjUxIDY4NS4wMyAxMTAuOTggQyA2OTcuMzAgMTM0LjcwIDcwMy4xNyAxNjEuMTUgNzA2LjAwIDE4Ny41NiBMIDcwNi4wMCA1MTkuNTMgQyA3MDMuNDYgNTQ4LjY4IDY5NS4yNyA1NzcuNDEgNjgxLjE1IDYwMy4wOSBDIDY1My40MCA2NTQuMDAgNjAyLjM5IDY5MS4zMCA1NDUuNTIgNzAyLjQ3IEMgNTM1LjIxIDcwNC4zMSA1MjQuODMgNzA1LjcyIDUxNC40NCA3MDcuMDAgTCAxOTEuNDggNzA3LjAwIEMgMTY2LjI3IDcwNC44NyAxNDEuMTUgNjk5LjQxIDExOC4wOCA2ODguODYgQyA4NC4zMCA2NzMuNTIgNTQuNDcgNjQ5LjA0IDM0LjEwIDYxNy45MSBDIDEzLjg3IDU4OS4wMiAzLjQ3IDU1NC4zNiAwLjAwIDUxOS41MSBMIDAuMDAgMTg3LjU2IEMgMi43NSAxNjIuNjQgNy45MCAxMzcuNjMgMTkuMDUgMTE1LjAyIEMgMzQuNTAgODEuNzcgNTkuNTYgNTMuMzEgOTAuMDggMzMuMDggQyAxMTguODkgMTMuNjcgMTUzLjAwIDMuMDAgMTg3LjQ3IDAuMDAgTSAzMDUuMjAgMTc5LjQyIEMgMzA1LjA2IDE4Ny4wNyAzMDUuMDEgMTk0LjcyIDMwNS4wMiAyMDIuMzcgQyAyOTEuMDYgMjA2LjU4IDI3Ni4wNiAyMDYuNTAgMjYyLjYxIDIxMi41NCBDIDI0Mi4yNiAyMjAuNzIgMjIyLjE1IDIzMS44OCAyMDguODQgMjQ5Ljg0IEMgMjE5LjUwIDI1MS40OCAyMzAuMDYgMjUzLjkwIDI0MC43NiAyNTUuMjAgQyAyNTEuOTUgMjQ5LjIyIDI2Mi4xNSAyNDAuODggMjc0LjU4IDIzNy40NSBDIDI4NC42NSAyMzQuNjQgMjk1LjQwIDIzMC43NyAzMDUuOTYgMjMzLjMwIEMgMzA2LjA1IDI0MC42MSAzMDYuMjggMjQ3LjkyIDMwNi43NCAyNTUuMjMgQyAzMjMuNzMgMjQyLjk5IDM0MC4yMCAyMzAuMDEgMzU2LjM0IDIxNi42OCBDIDM0NS45NyAyMDcuNTcgMzM0LjQ3IDE5OS45MCAzMjMuNTYgMTkxLjQ4IEMgMzE3LjU3IDE4Ny4yNiAzMTEuNjggMTgyLjg2IDMwNS4yMCAxNzkuNDIgTSA0MzQuMTUgMjI0LjE2IEMgNDI2LjIwIDIzMy40NiA0MTguNjggMjQzLjgyIDQxNS4zNCAyNTUuNzggQyA0MjkuMDMgMjU4LjYwIDQ0My4wMiAyNTkuODUgNDU2Ljk4IDI2MC4yMyBDIDQ1Ny4wMiAyNDMuMjMgNDU3LjEwIDIyNi4yMyA0NTYuODEgMjA5LjI0IEMgNDQ4LjM4IDIxMi42OCA0NDAuMDMgMjE3LjAwIDQzNC4xNSAyMjQuMTYgTSA0NjkuMTMgMjA5LjE4IEMgNDY4Ljg2IDIyNi4wOSA0NjguODUgMjQzLjAxIDQ2OS4zMyAyNTkuOTIgQyA0NzkuOTkgMjU5LjgyIDQ5MC42NCAyNTguOTYgNTAxLjE4IDI1Ny4zNiBDIDUwNC41NCAyNTYuNzAgNTA4LjQ4IDI1Ni41NyA1MTEuMjUgMjU0LjIwIEMgNTAzLjY0IDIzNC44NCA0ODkuOTMgMjE1LjM4IDQ2OS4xMyAyMDkuMTggTSA0MTAuNzIgMjE4LjczIEMgMzk4LjE3IDIyNS4zNSAzODUuNDUgMjMyLjYzIDM3Ni4zMSAyNDMuNzQgQyAzODQuODQgMjQ3Ljc0IDM5My44NyAyNTAuNTggNDAyLjg4IDI1My4zMiBDIDQwOC44MiAyMzguMDMgNDE4LjIxIDIyNC40NCA0MjkuMTQgMjEyLjMwIEMgNDIyLjYyIDIxMy4xMSA0MTYuNjUgMjE2LjEwIDQxMC43MiAyMTguNzMgTSA0OTcuNjQgMjEyLjYxIEMgNTA3LjE2IDIyNC43NiA1MTYuNTIgMjM3LjA5IDUyMy4wNiAyNTEuMTcgQyA1MzIuMzUgMjQ5LjM4IDU0MS42NCAyNDcuMzEgNTUwLjQ5IDI0My44OSBDIDUzNi40NiAyMjguNjQgNTE3Ljc4IDIxNy41MyA0OTcuNjQgMjEyLjYxIE0gMzY2LjM5IDI1My42NiBDIDM1MS4wNSAyNzQuMzggMzQwLjMzIDI5OS4wNiAzMzkuNzcgMzI1LjEyIEMgMzU2LjExIDMyNi4wOSAzNzIuNDggMzI0Ljk3IDM4OC44NCAzMjUuMTQgQyAzOTAuMDEgMzA0LjUyIDM5Mi42NSAyODMuOTcgMzk4LjI3IDI2NC4wNSBDIDM4Ny40MiAyNjEuMjcgMzc3LjE2IDI1Ni42NiAzNjYuMzkgMjUzLjY2IE0gNTM5LjQ1IDI2MC41NCBDIDUyNS43NiAyNjEuNjQgNTEyLjA4IDI2NS42NiA1MDEuMTEgMjc0LjE2IEMgNDczLjczIDI5Mi44OSA0NjIuMzQgMzMxLjYwIDQ3Ni4wNyAzNjEuOTcgQyA0ODguMTIgMzkyLjU3IDUyMi45MiA0MTAuNjIgNTU0Ljk3IDQwNi4wNSBDIDU4NC4wMyA0MDMuOTIgNjA5Ljg5IDM4MS43MiA2MTcuODggMzUzLjk1IEMgNjIzLjE4IDMzOC41MSA2MjEuMTcgMzIxLjQxIDYxNS42OCAzMDYuMzEgQyA2MDQuMDYgMjc2LjUwIDU3MS4yOCAyNTYuNjQgNTM5LjQ1IDI2MC41NCBNIDEwOS4yNyAzMTEuMjYgQyA4OC4zOSAzMzYuNDQgODUuNjYgMzczLjI4IDk4LjExIDQwMi45MCBDIDEwNC43MCA0MTcuODcgMTE1LjI5IDQzMC43OSAxMjcuODkgNDQxLjEzIEMgMTM0LjE5IDQ0NS4wMCAxMzAuODUgNDUzLjEzIDEzMC45NyA0NTguOTcgQyAxMzAuNDUgNDY5Ljg3IDEyNS4yMSA0NzkuNjIgMTIxLjk0IDQ4OS44MiBDIDEzMC4yNyA0ODkuMjggMTM4LjUyIDQ4Ny41OCAxNDYuMjQgNDg0LjMxIEMgMTU3LjQ4IDQ4MC4yMCAxNjYuNDMgNDcyLjAxIDE3NS4xNiA0NjQuMTMgQyAyMjEuODAgNDc2LjQ0IDI3NS43OCA0NTguNDcgMzAyLjk1IDQxNy45NyBDIDMyMS43NCAzOTAuNzcgMzIyLjU2IDM1My40NyAzMDcuNjQgMzI0LjM2IEMgMjg5LjU4IDI5MC41OCAyNTIuODcgMjY4LjYyIDIxNC45NiAyNjYuMDYgQyAxNzUuMjAgMjYxLjk4IDEzMi45MyAyNzguNDQgMTA5LjI3IDMxMS4yNiBNIDQwOS44MyAyNjYuODUgQyA0MDQuMDggMjg1LjM1IDQwMS41MiAzMDQuNTQgNDAwLjA4IDMyMy43OSBDIDQwMC43OSAzMjQuNDEgNDAxLjUxIDMyNS4wMyA0MDIuMjQgMzI1LjY1IEMgNDIwLjczIDMyNC43MCA0MzkuMjUgMzI1LjIyIDQ1Ny43NSAzMjQuNjYgQyA0NTYuNTAgMzA3LjI1IDQ1Ny4zMCAyODkuNzggNDU2LjY3IDI3Mi4zNiBDIDQ0MC45NCAyNzEuNjEgNDI1LjMxIDI2OS43MSA0MDkuODMgMjY2Ljg1IE0gNDY5LjA4IDI3Mi40MSBDIDQ2OS4zMCAyNzguNTEgNDY5LjU4IDI4NC42MiA0NzAuMjMgMjkwLjcwIEMgNDc1LjcxIDI4NC41MyA0ODAuNjkgMjc3Ljk0IDQ4NS42MCAyNzEuMzIgQyA0ODAuMDkgMjcxLjYxIDQ3NC41OCAyNzIuMDEgNDY5LjA4IDI3Mi40MSBNIDMzOS44MSAzMzcuNzEgQyAzNDEuMjQgMzYzLjY1IDM1MC41MCAzODkuMTYgMzY3LjE2IDQwOS4yMSBDIDM3Ny42MCA0MDUuMTcgMzg4LjE3IDQwMS41MiAzOTguODYgMzk4LjE5IEMgMzkyLjQwIDM3OC42OCAzODkuNDYgMzU4LjE0IDM4OC43MyAzMzcuNjQgQyAzNzIuNDIgMzM4LjExIDM1Ni4xMSAzMzcuMjYgMzM5LjgxIDMzNy43MSBNIDQwMi4yMSAzMzcuMTggQyA0MDEuNTUgMzM3Ljg2IDQwMC44OSAzMzguNTQgNDAwLjIzIDMzOS4yMyBDIDQwMS42MiAzNTguNTQgNDA0LjUwIDM3Ny44MCA0MTAuODYgMzk2LjE2IEMgNDI1Ljk1IDM5Mi4zNCA0NDEuNDMgMzkwLjUyIDQ1Ni45NiAzODkuODAgQyA0NTYuODMgMzcyLjY1IDQ1Ny42MCAzNTUuNDkgNDU2LjcwIDMzOC4zNyBDIDQ1Ni40MyAzMzguMTAgNDU1Ljg5IDMzNy41NSA0NTUuNjIgMzM3LjI3IEMgNDM3LjgzIDMzNS45NSA0MjAuMDEgMzM4LjE2IDQwMi4yMSAzMzcuMTggTSA0NjkuODEgMzc1LjQwIEMgNDY5LjM1IDM4MC4xNyA0NjkuMzEgMzg0Ljk1IDQ2OS4xNyAzODkuNzUgQyA0NzIuODUgMzg5Ljk3IDQ3Ni41NSAzOTAuMjIgNDgwLjI0IDM5MC4yNiBDIDQ3Ny4wMiAzODUuMTMgNDczLjUzIDM4MC4xNyA0NjkuODEgMzc1LjQwIE0gNDE0LjgwIDQwNy41OSBDIDQyMC42OCA0MTkuMzUgNDI2LjM5IDQzMS43MiA0MzYuMTkgNDQwLjgxIEMgNDQyLjA0IDQ0Ni42OCA0NDkuMTcgNDUxLjgxIDQ1Ny40NyA0NTMuMzQgQyA0NTYuODggNDM2LjI2IDQ1Ny4xMyA0MTkuMTcgNDU2LjY2IDQwMi4wOSBDIDQ0Mi41OSA0MDIuNjIgNDI4LjQzIDQwMy44OCA0MTQuODAgNDA3LjU5IE0gNDY5LjY3IDQwMS43OSBDIDQ2OC4zNyA0MTguOTAgNDY4Ljg5IDQzNi4xMiA0NjkuNDggNDUzLjI1IEMgNDgxLjEzIDQ1MS4xMCA0ODkuODEgNDQxLjczIDQ5Ny4wMSA0MzMuMDAgQyA1MDEuNTIgNDI2LjEzIDUwNy4wOSA0MTkuMzAgNTA5LjAzIDQxMS4xOCBDIDQ5OC40NiA0MDEuNDQgNDgyLjk3IDQwMi44MyA0NjkuNjcgNDAxLjc5IE0gMzc2LjI1IDQxOC43MyBDIDM5MC40OCA0MzMuNTMgNDA4LjU5IDQ0NC44NyA0MjguNTMgNDUwLjA3IEMgNDI0LjExIDQ0Mi41MSA0MTcuNDggNDM2LjUzIDQxMy4wMiA0MjguOTkgQyA0MDkuMDAgNDIzLjA1IDQwNi40OSA0MTYuMjkgNDAzLjYxIDQwOS43OCBDIDM5NC4yMSA0MTEuNzUgMzg0Ljc1IDQxNC4xNiAzNzYuMjUgNDE4LjczIE0gNTIwLjc5IDQxNS4yMyBDIDUxNS4yMiA0MjcuNzAgNTA2LjM0IDQzOC4xNCA0OTguNTIgNDQ5LjE5IEMgNTA3LjQ2IDQ0Ny4yNiA1MTUuODQgNDQzLjMxIDUyMy43MiA0MzguNzQgQyA1MzIuOTcgNDMzLjI2IDU0Mi4xMyA0MjcuMzQgNTQ5LjM5IDQxOS4yOSBDIDUzOS44NCA0MTguMTIgNTMwLjI2IDQxNi45NyA1MjAuNzkgNDE1LjIzIE0gMzQ1LjAyIDQ3Ny45NiBDIDMyMS41MSA0NzkuNjQgMjk4LjIzIDQ3Mi41NSAyNzcuOTcgNDYwLjk5IEMgMjY4LjgxIDQ2Ni4zNCAyNTkuMTcgNDcwLjc5IDI0OS41OSA0NzUuMzEgQyAyNjguMDAgNDkxLjg0IDI5Mi41NiA0OTkuNTUgMzE2LjUzIDUwMy41NyBDIDM0MC40OCA1MDYuODMgMzY1LjIxIDUwNS4wOSAzODguMTMgNDk3LjIxIEMgNDA2Ljg2IDQ5MC42MyA0MjUuMzggNDgxLjIyIDQzOC43MSA0NjYuMTkgQyA0MjguNTEgNDYyLjU4IDQxNy42OSA0NjAuODYgNDA3Ljg0IDQ1Ni4yNSBDIDM4OS4xNCA0NjguNjEgMzY3LjM5IDQ3Ni4zOCAzNDUuMDIgNDc3Ljk2IFoiIC8+CjxwYXRoIGZpbGw9IiMxMTdmZTkiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDUzMC4xNiAyOTUuMDggQyA1MzAuNjUgMjkwLjI0IDUzNy4zNyAyODguNDIgNTQxLjA1IDI5MC45MyBDIDU0Ny4yNCAyOTMuNzQgNTQ3LjMzIDMwMS43NyA1NTIuMDMgMzA1Ljk1IEMgNTYwLjYwIDMwNy43NSA1NjkuNjUgMzA2LjQyIDU3OC4zNCAzMDcuNzkgQyA1ODIuNjUgMzA5LjA2IDU4NS4xMiAzMTQuNzMgNTgyLjY1IDMxOC42NSBDIDU4MC4xNSAzMjMuMDUgNTczLjg2IDMyMS4zOCA1NjkuODUgMzIyLjkyIEMgNTY3LjIxIDMzMy44NCA1NjEuNjcgMzQzLjYyIDU1NS41MyAzNTIuOTAgQyA1NjIuNTYgMzU2Ljc2IDU3MC4xNiAzNTkuMjUgNTc3Ljg3IDM2MS4zNSBDIDU4Mi43MyAzNjIuNzYgNTgzLjkzIDM2OS4xNyA1ODAuOTQgMzcyLjkwIEMgNTc4LjYwIDM3Ny43NCA1NzIuNTIgMzc2LjcyIDU2OC4xNiAzNzUuODIgQyA1NTkuMDQgMzczLjUwIDU1MC43MCAzNjguODYgNTQyLjc3IDM2My45MyBDIDUzNC4wNCAzNjguNzEgNTI1LjQwIDM3NC4zNSA1MTUuNTIgMzc2LjM3IEMgNTExLjI3IDM3OC4yMiA1MDUuNDkgMzc2LjI5IDUwNC4zNSAzNzEuNjAgQyA1MDMuOTMgMzY5LjAzIDUwMy4xNCAzNjMuOTkgNTA2LjQ1IDM2Mi42NiBDIDUxNC40NSAzNTkuODAgNTIyLjQ5IDM1Ny4wMSA1MzAuMjkgMzUzLjYyIEMgNTI1LjcyIDM0Ni4zNCA1MTkuNjcgMzM5LjgzIDUxNy4wNiAzMzEuNDggQyA1MTguNDkgMzI5Ljg0IDUyMS4zNiAzMjYuNTUgNTIyLjc5IDMyNC45MCBDIDUzMS41MiAzMjcuODEgNTM2LjExIDMzNi4xMyA1NDEuNTggMzQyLjg4IEMgNTQ2LjY0IDMzNy4xOCA1NTAuMTAgMzMwLjMyIDU1Mi41NiAzMjMuMTUgQyA1MzcuMTUgMzIyLjczIDUyMS42OSAzMjMuNzEgNTA2LjMyIDMyMi41NyBDIDUwMC43MSAzMTkuOTYgNTAwLjg4IDMxMS4wNyA1MDYuNDMgMzA4LjU2IEMgNTE1LjEwIDMwNy4xNSA1MjMuOTAgMzA3LjAwIDUzMi42NyAzMDYuNTMgQyA1MzEuNTIgMzAyLjgwIDUzMC4zMCAyOTkuMDEgNTMwLjE2IDI5NS4wOCBaIiAvPgo8cGF0aCBmaWxsPSIjMTE3ZmU5IiBvcGFjaXR5PSIxLjAwIiBkPSIgTSAxODEuNDUgMzIxLjQ4IEMgMTkyLjU1IDMyMC40NSAyMDUuMTcgMzE5LjU0IDIxNC44NSAzMjYuMTUgQyAyMjYuODYgMzQ0LjUzIDIzMi4xMCAzNjYuMzcgMjM5LjA3IDM4Ni45OCBDIDI0MC41OSAzOTQuMzYgMjQ2Ljg4IDQwNC42NyAyMzcuNjUgNDA5LjYxIEMgMjMyLjYyIDQxMS4zNSAyMjQuMzkgNDEzLjQ0IDIyMS40NyA0MDcuNjEgQyAyMTguNDYgNDAyLjgwIDIxOC43OSAzOTYuMjIgMjE1LjI0IDM5MS45MSBDIDIwNi40MSAzOTAuODMgMTk3LjE2IDM5MS42MCAxODguMjUgMzkyLjM1IEMgMTgzLjMxIDM5Ny4xOCAxODUuMzQgNDA2LjI0IDE3OS43MCA0MTAuNzAgQyAxNzQuNzIgNDEzLjYwIDE2OC4zOSA0MTAuOTQgMTY0LjM4IDQwNy42NCBDIDE2MC45NSA0MDMuMzcgMTYxLjk4IDM5Ny4xNCAxNjMuNTQgMzkyLjMzIEMgMTY4LjY5IDM3NC42MCAxNzQuNzEgMzU3LjA3IDE4My4yOSAzNDAuNjcgQyAxODAuOTYgMzM5LjQxIDE3OC4yNSAzMzguNTkgMTc2LjQ0IDMzNi41NiBDIDE3My45MiAzMzEuMzggMTc1LjgxIDMyMy43MiAxODEuNDUgMzIxLjQ4IE0gMTkyLjAxIDM3Mi42OCBDIDE5Ny45OSAzNzIuNzYgMjAzLjk3IDM3Mi43MiAyMDkuOTUgMzcyLjYzIEMgMjA4LjM5IDM2My4yMiAyMDUuNDcgMzU0LjEyIDIwMS42OSAzNDUuMzggQyAxOTYuODggMzUzLjgyIDE5NC41MiAzNjMuMzcgMTkyLjAxIDM3Mi42OCBaIiAvPgo8L2c+CjxnIGlkPSIjZmZmZmZmZmYiPgo8cGF0aCBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIxLjAwIiBkPSIgTSAzMDUuMjAgMTc5LjQyIEMgMzExLjY4IDE4Mi44NiAzMTcuNTcgMTg3LjI2IDMyMy41NiAxOTEuNDggQyAzMzQuNDcgMTk5LjkwIDM0NS45NyAyMDcuNTcgMzU2LjM0IDIxNi42OCBDIDM0MC4yMCAyMzAuMDEgMzIzLjczIDI0Mi45OSAzMDYuNzQgMjU1LjIzIEMgMzA2LjI4IDI0Ny45MiAzMDYuMDUgMjQwLjYxIDMwNS45NiAyMzMuMzAgQyAyOTUuNDAgMjMwLjc3IDI4NC42NSAyMzQuNjQgMjc0LjU4IDIzNy40NSBDIDI2Mi4xNSAyNDAuODggMjUxLjk1IDI0OS4yMiAyNDAuNzYgMjU1LjIwIEMgMjMwLjA2IDI1My45MCAyMTkuNTAgMjUxLjQ4IDIwOC44NCAyNDkuODQgQyAyMjIuMTUgMjMxLjg4IDI0Mi4yNiAyMjAuNzIgMjYyLjYxIDIxMi41NCBDIDI3Ni4wNiAyMDYuNTAgMjkxLjA2IDIwNi41OCAzMDUuMDIgMjAyLjM3IEMgMzA1LjAxIDE5NC43MiAzMDUuMDYgMTg3LjA3IDMwNS4yMCAxNzkuNDIgWiIgLz4KPHBhdGggZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gNDM0LjE1IDIyNC4xNiBDIDQ0MC4wMyAyMTcuMDAgNDQ4LjM4IDIxMi42OCA0NTYuODEgMjA5LjI0IEMgNDU3LjEwIDIyNi4yMyA0NTcuMDIgMjQzLjIzIDQ1Ni45OCAyNjAuMjMgQyA0NDMuMDIgMjU5Ljg1IDQyOS4wMyAyNTguNjAgNDE1LjM0IDI1NS43OCBDIDQxOC42OCAyNDMuODIgNDI2LjIwIDIzMy40NiA0MzQuMTUgMjI0LjE2IFoiIC8+CjxwYXRoIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDQ2OS4xMyAyMDkuMTggQyA0ODkuOTMgMjE1LjM4IDUwMy42NCAyMzQuODQgNTExLjI1IDI1NC4yMCBDIDUwOC40OCAyNTYuNTcgNTA0LjU0IDI1Ni43MCA1MDEuMTggMjU3LjM2IEMgNDkwLjY0IDI1OC45NiA0NzkuOTkgMjU5LjgyIDQ2OS4zMyAyNTkuOTIgQyA0NjguODUgMjQzLjAxIDQ2OC44NiAyMjYuMDkgNDY5LjEzIDIwOS4xOCBaIiAvPgo8cGF0aCBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIxLjAwIiBkPSIgTSA0MTAuNzIgMjE4LjczIEMgNDE2LjY1IDIxNi4xMCA0MjIuNjIgMjEzLjExIDQyOS4xNCAyMTIuMzAgQyA0MTguMjEgMjI0LjQ0IDQwOC44MiAyMzguMDMgNDAyLjg4IDI1My4zMiBDIDM5My44NyAyNTAuNTggMzg0Ljg0IDI0Ny43NCAzNzYuMzEgMjQzLjc0IEMgMzg1LjQ1IDIzMi42MyAzOTguMTcgMjI1LjM1IDQxMC43MiAyMTguNzMgWiIgLz4KPHBhdGggZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gNDk3LjY0IDIxMi42MSBDIDUxNy43OCAyMTcuNTMgNTM2LjQ2IDIyOC42NCA1NTAuNDkgMjQzLjg5IEMgNTQxLjY0IDI0Ny4zMSA1MzIuMzUgMjQ5LjM4IDUyMy4wNiAyNTEuMTcgQyA1MTYuNTIgMjM3LjA5IDUwNy4xNiAyMjQuNzYgNDk3LjY0IDIxMi42MSBaIiAvPgo8cGF0aCBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIxLjAwIiBkPSIgTSAzNjYuMzkgMjUzLjY2IEMgMzc3LjE2IDI1Ni42NiAzODcuNDIgMjYxLjI3IDM5OC4yNyAyNjQuMDUgQyAzOTIuNjUgMjgzLjk3IDM5MC4wMSAzMDQuNTIgMzg4Ljg0IDMyNS4xNCBDIDM3Mi40OCAzMjQuOTcgMzU2LjExIDMyNi4wOSAzMzkuNzcgMzI1LjEyIEMgMzQwLjMzIDI5OS4wNiAzNTEuMDUgMjc0LjM4IDM2Ni4zOSAyNTMuNjYgWiIgLz4KPHBhdGggZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gNTM5LjQ1IDI2MC41NCBDIDU3MS4yOCAyNTYuNjQgNjA0LjA2IDI3Ni41MCA2MTUuNjggMzA2LjMxIEMgNjIxLjE3IDMyMS40MSA2MjMuMTggMzM4LjUxIDYxNy44OCAzNTMuOTUgQyA2MDkuODkgMzgxLjcyIDU4NC4wMyA0MDMuOTIgNTU0Ljk3IDQwNi4wNSBDIDUyMi45MiA0MTAuNjIgNDg4LjEyIDM5Mi41NyA0NzYuMDcgMzYxLjk3IEMgNDYyLjM0IDMzMS42MCA0NzMuNzMgMjkyLjg5IDUwMS4xMSAyNzQuMTYgQyA1MTIuMDggMjY1LjY2IDUyNS43NiAyNjEuNjQgNTM5LjQ1IDI2MC41NCBNIDUzMC4xNiAyOTUuMDggQyA1MzAuMzAgMjk5LjAxIDUzMS41MiAzMDIuODAgNTMyLjY3IDMwNi41MyBDIDUyMy45MCAzMDcuMDAgNTE1LjEwIDMwNy4xNSA1MDYuNDMgMzA4LjU2IEMgNTAwLjg4IDMxMS4wNyA1MDAuNzEgMzE5Ljk2IDUwNi4zMiAzMjIuNTcgQyA1MjEuNjkgMzIzLjcxIDUzNy4xNSAzMjIuNzMgNTUyLjU2IDMyMy4xNSBDIDU1MC4xMCAzMzAuMzIgNTQ2LjY0IDMzNy4xOCA1NDEuNTggMzQyLjg4IEMgNTM2LjExIDMzNi4xMyA1MzEuNTIgMzI3LjgxIDUyMi43OSAzMjQuOTAgQyA1MjEuMzYgMzI2LjU1IDUxOC40OSAzMjkuODQgNTE3LjA2IDMzMS40OCBDIDUxOS42NyAzMzkuODMgNTI1LjcyIDM0Ni4zNCA1MzAuMjkgMzUzLjYyIEMgNTIyLjQ5IDM1Ny4wMSA1MTQuNDUgMzU5LjgwIDUwNi40NSAzNjIuNjYgQyA1MDMuMTQgMzYzLjk5IDUwMy45MyAzNjkuMDMgNTA0LjM1IDM3MS42MCBDIDUwNS40OSAzNzYuMjkgNTExLjI3IDM3OC4yMiA1MTUuNTIgMzc2LjM3IEMgNTI1LjQwIDM3NC4zNSA1MzQuMDQgMzY4LjcxIDU0Mi43NyAzNjMuOTMgQyA1NTAuNzAgMzY4Ljg2IDU1OS4wNCAzNzMuNTAgNTY4LjE2IDM3NS44MiBDIDU3Mi41MiAzNzYuNzIgNTc4LjYwIDM3Ny43NCA1ODAuOTQgMzcyLjkwIEMgNTgzLjkzIDM2OS4xNyA1ODIuNzMgMzYyLjc2IDU3Ny44NyAzNjEuMzUgQyA1NzAuMTYgMzU5LjI1IDU2Mi41NiAzNTYuNzYgNTU1LjUzIDM1Mi45MCBDIDU2MS42NyAzNDMuNjIgNTY3LjIxIDMzMy44NCA1NjkuODUgMzIyLjkyIEMgNTczLjg2IDMyMS4zOCA1ODAuMTUgMzIzLjA1IDU4Mi42NSAzMTguNjUgQyA1ODUuMTIgMzE0LjczIDU4Mi42NSAzMDkuMDYgNTc4LjM0IDMwNy43OSBDIDU2OS42NSAzMDYuNDIgNTYwLjYwIDMwNy43NSA1NTIuMDMgMzA1Ljk1IEMgNTQ3LjMzIDMwMS43NyA1NDcuMjQgMjkzLjc0IDU0MS4wNSAyOTAuOTMgQyA1MzcuMzcgMjg4LjQyIDUzMC42NSAyOTAuMjQgNTMwLjE2IDI5NS4wOCBaIiAvPgo8cGF0aCBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIxLjAwIiBkPSIgTSAxMDkuMjcgMzExLjI2IEMgMTMyLjkzIDI3OC40NCAxNzUuMjAgMjYxLjk4IDIxNC45NiAyNjYuMDYgQyAyNTIuODcgMjY4LjYyIDI4OS41OCAyOTAuNTggMzA3LjY0IDMyNC4zNiBDIDMyMi41NiAzNTMuNDcgMzIxLjc0IDM5MC43NyAzMDIuOTUgNDE3Ljk3IEMgMjc1Ljc4IDQ1OC40NyAyMjEuODAgNDc2LjQ0IDE3NS4xNiA0NjQuMTMgQyAxNjYuNDMgNDcyLjAxIDE1Ny40OCA0ODAuMjAgMTQ2LjI0IDQ4NC4zMSBDIDEzOC41MiA0ODcuNTggMTMwLjI3IDQ4OS4yOCAxMjEuOTQgNDg5LjgyIEMgMTI1LjIxIDQ3OS42MiAxMzAuNDUgNDY5Ljg3IDEzMC45NyA0NTguOTcgQyAxMzAuODUgNDUzLjEzIDEzNC4xOSA0NDUuMDAgMTI3Ljg5IDQ0MS4xMyBDIDExNS4yOSA0MzAuNzkgMTA0LjcwIDQxNy44NyA5OC4xMSA0MDIuOTAgQyA4NS42NiAzNzMuMjggODguMzkgMzM2LjQ0IDEwOS4yNyAzMTEuMjYgTSAxODEuNDUgMzIxLjQ4IEMgMTc1LjgxIDMyMy43MiAxNzMuOTIgMzMxLjM4IDE3Ni40NCAzMzYuNTYgQyAxNzguMjUgMzM4LjU5IDE4MC45NiAzMzkuNDEgMTgzLjI5IDM0MC42NyBDIDE3NC43MSAzNTcuMDcgMTY4LjY5IDM3NC42MCAxNjMuNTQgMzkyLjMzIEMgMTYxLjk4IDM5Ny4xNCAxNjAuOTUgNDAzLjM3IDE2NC4zOCA0MDcuNjQgQyAxNjguMzkgNDEwLjk0IDE3NC43MiA0MTMuNjAgMTc5LjcwIDQxMC43MCBDIDE4NS4zNCA0MDYuMjQgMTgzLjMxIDM5Ny4xOCAxODguMjUgMzkyLjM1IEMgMTk3LjE2IDM5MS42MCAyMDYuNDEgMzkwLjgzIDIxNS4yNCAzOTEuOTEgQyAyMTguNzkgMzk2LjIyIDIxOC40NiA0MDIuODAgMjIxLjQ3IDQwNy42MSBDIDIyNC4zOSA0MTMuNDQgMjMyLjYyIDQxMS4zNSAyMzcuNjUgNDA5LjYxIEMgMjQ2Ljg4IDQwNC42NyAyNDAuNTkgMzk0LjM2IDIzOS4wNyAzODYuOTggQyAyMzIuMTAgMzY2LjM3IDIyNi44NiAzNDQuNTMgMjE0Ljg1IDMyNi4xNSBDIDIwNS4xNyAzMTkuNTQgMTkyLjU1IDMyMC40NSAxODEuNDUgMzIxLjQ4IFoiIC8+CjxwYXRoIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDQwOS44MyAyNjYuODUgQyA0MjUuMzEgMjY5LjcxIDQ0MC45NCAyNzEuNjEgNDU2LjY3IDI3Mi4zNiBDIDQ1Ny4zMCAyODkuNzggNDU2LjUwIDMwNy4yNSA0NTcuNzUgMzI0LjY2IEMgNDM5LjI1IDMyNS4yMiA0MjAuNzMgMzI0LjcwIDQwMi4yNCAzMjUuNjUgQyA0MDEuNTEgMzI1LjAzIDQwMC43OSAzMjQuNDEgNDAwLjA4IDMyMy43OSBDIDQwMS41MiAzMDQuNTQgNDA0LjA4IDI4NS4zNSA0MDkuODMgMjY2Ljg1IFoiIC8+CjxwYXRoIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDQ2OS4wOCAyNzIuNDEgQyA0NzQuNTggMjcyLjAxIDQ4MC4wOSAyNzEuNjEgNDg1LjYwIDI3MS4zMiBDIDQ4MC42OSAyNzcuOTQgNDc1LjcxIDI4NC41MyA0NzAuMjMgMjkwLjcwIEMgNDY5LjU4IDI4NC42MiA0NjkuMzAgMjc4LjUxIDQ2OS4wOCAyNzIuNDEgWiIgLz4KPHBhdGggZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gMzM5LjgxIDMzNy43MSBDIDM1Ni4xMSAzMzcuMjYgMzcyLjQyIDMzOC4xMSAzODguNzMgMzM3LjY0IEMgMzg5LjQ2IDM1OC4xNCAzOTIuNDAgMzc4LjY4IDM5OC44NiAzOTguMTkgQyAzODguMTcgNDAxLjUyIDM3Ny42MCA0MDUuMTcgMzY3LjE2IDQwOS4yMSBDIDM1MC41MCAzODkuMTYgMzQxLjI0IDM2My42NSAzMzkuODEgMzM3LjcxIFoiIC8+CjxwYXRoIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDQwMi4yMSAzMzcuMTggQyA0MjAuMDEgMzM4LjE2IDQzNy44MyAzMzUuOTUgNDU1LjYyIDMzNy4yNyBDIDQ1NS44OSAzMzcuNTUgNDU2LjQzIDMzOC4xMCA0NTYuNzAgMzM4LjM3IEMgNDU3LjYwIDM1NS40OSA0NTYuODMgMzcyLjY1IDQ1Ni45NiAzODkuODAgQyA0NDEuNDMgMzkwLjUyIDQyNS45NSAzOTIuMzQgNDEwLjg2IDM5Ni4xNiBDIDQwNC41MCAzNzcuODAgNDAxLjYyIDM1OC41NCA0MDAuMjMgMzM5LjIzIEMgNDAwLjg5IDMzOC41NCA0MDEuNTUgMzM3Ljg2IDQwMi4yMSAzMzcuMTggWiIgLz4KPHBhdGggZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gMTkyLjAxIDM3Mi42OCBDIDE5NC41MiAzNjMuMzcgMTk2Ljg4IDM1My44MiAyMDEuNjkgMzQ1LjM4IEMgMjA1LjQ3IDM1NC4xMiAyMDguMzkgMzYzLjIyIDIwOS45NSAzNzIuNjMgQyAyMDMuOTcgMzcyLjcyIDE5Ny45OSAzNzIuNzYgMTkyLjAxIDM3Mi42OCBaIiAvPgo8cGF0aCBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIxLjAwIiBkPSIgTSA0NjkuODEgMzc1LjQwIEMgNDczLjUzIDM4MC4xNyA0NzcuMDIgMzg1LjEzIDQ4MC4yNCAzOTAuMjYgQyA0NzYuNTUgMzkwLjIyIDQ3Mi44NSAzODkuOTcgNDY5LjE3IDM4OS43NSBDIDQ2OS4zMSAzODQuOTUgNDY5LjM1IDM4MC4xNyA0NjkuODEgMzc1LjQwIFoiIC8+CjxwYXRoIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDQxNC44MCA0MDcuNTkgQyA0MjguNDMgNDAzLjg4IDQ0Mi41OSA0MDIuNjIgNDU2LjY2IDQwMi4wOSBDIDQ1Ny4xMyA0MTkuMTcgNDU2Ljg4IDQzNi4yNiA0NTcuNDcgNDUzLjM0IEMgNDQ5LjE3IDQ1MS44MSA0NDIuMDQgNDQ2LjY4IDQzNi4xOSA0NDAuODEgQyA0MjYuMzkgNDMxLjcyIDQyMC42OCA0MTkuMzUgNDE0LjgwIDQwNy41OSBaIiAvPgo8cGF0aCBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIxLjAwIiBkPSIgTSA0NjkuNjcgNDAxLjc5IEMgNDgyLjk3IDQwMi44MyA0OTguNDYgNDAxLjQ0IDUwOS4wMyA0MTEuMTggQyA1MDcuMDkgNDE5LjMwIDUwMS41MiA0MjYuMTMgNDk3LjAxIDQzMy4wMCBDIDQ4OS44MSA0NDEuNzMgNDgxLjEzIDQ1MS4xMCA0NjkuNDggNDUzLjI1IEMgNDY4Ljg5IDQzNi4xMiA0NjguMzcgNDE4LjkwIDQ2OS42NyA0MDEuNzkgWiIgLz4KPHBhdGggZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gMzc2LjI1IDQxOC43MyBDIDM4NC43NSA0MTQuMTYgMzk0LjIxIDQxMS43NSA0MDMuNjEgNDA5Ljc4IEMgNDA2LjQ5IDQxNi4yOSA0MDkuMDAgNDIzLjA1IDQxMy4wMiA0MjguOTkgQyA0MTcuNDggNDM2LjUzIDQyNC4xMSA0NDIuNTEgNDI4LjUzIDQ1MC4wNyBDIDQwOC41OSA0NDQuODcgMzkwLjQ4IDQzMy41MyAzNzYuMjUgNDE4LjczIFoiIC8+CjxwYXRoIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDUyMC43OSA0MTUuMjMgQyA1MzAuMjYgNDE2Ljk3IDUzOS44NCA0MTguMTIgNTQ5LjM5IDQxOS4yOSBDIDU0Mi4xMyA0MjcuMzQgNTMyLjk3IDQzMy4yNiA1MjMuNzIgNDM4Ljc0IEMgNTE1Ljg0IDQ0My4zMSA1MDcuNDYgNDQ3LjI2IDQ5OC41MiA0NDkuMTkgQyA1MDYuMzQgNDM4LjE0IDUxNS4yMiA0MjcuNzAgNTIwLjc5IDQxNS4yMyBaIiAvPgo8cGF0aCBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIxLjAwIiBkPSIgTSAzNDUuMDIgNDc3Ljk2IEMgMzY3LjM5IDQ3Ni4zOCAzODkuMTQgNDY4LjYxIDQwNy44NCA0NTYuMjUgQyA0MTcuNjkgNDYwLjg2IDQyOC41MSA0NjIuNTggNDM4LjcxIDQ2Ni4xOSBDIDQyNS4zOCA0ODEuMjIgNDA2Ljg2IDQ5MC42MyAzODguMTMgNDk3LjIxIEMgMzY1LjIxIDUwNS4wOSAzNDAuNDggNTA2LjgzIDMxNi41MyA1MDMuNTcgQyAyOTIuNTYgNDk5LjU1IDI2OC4wMCA0OTEuODQgMjQ5LjU5IDQ3NS4zMSBDIDI1OS4xNyA0NzAuNzkgMjY4LjgxIDQ2Ni4zNCAyNzcuOTcgNDYwLjk5IEMgMjk4LjIzIDQ3Mi41NSAzMjEuNTEgNDc5LjY0IDM0NS4wMiA0NzcuOTYgWiIgLz4KPC9nPgo8L3N2Zz4=
// @match        *://jules.google.com/*
// @match        *://aistudio.google.com/*
// @match        *://claude.ai/*
// @match        *://platform.claude.com/*
// @match        *://status.anthropic.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      cdn.jsdelivr.net
// @connect      raw.githubusercontent.com
// @noframes
// ==/UserScript==

const EMBEDDED_TRANSLATIONS = {
  'zh-cn': {
    'aistudio.google.com': {
      language: 'zh-cn',
      enabled: true,
      styles: [],
      blockedElements: [],
      jsRules: [],
      regexRules: [
        [/↩\s*Add a new line\s*\s*Alt\s*\+\s*↩\s*Append text without running\s*\s*Ctrl\s*\+\s*↩\s*Run prompt/i, '↩  换行 Alt + ↩  追加文本 (不执行) Ctrl + ↩  执行指令'],
        [/Invalid JSON: SyntaxError: Unexpected token '(.+?)', "(.+?)" is not valid JSON/i, '无效的 JSON 语法错误：在 “$2” 中存在意外的字符 “$1”'],
        [/([<>]=?)\s*(\d+K)\s+tokens\s+•\s+Input:\s+\$([\d.]+)\s+\/\s+Output:\s+\$([\d.]+)/i, '$1$2 Tokens | 输入: $$ $3 / 输出: $$ $4'],
        [/Image \(\*Output per image\) • Input: \$([\d.]+) \/ Output: \$([\d.]+)/i, '图像 (*每张图片输出) | 输入: $$ $1 / 输出: $$ $2'],
        [/All context lengths\s+•\s+Input:\s+\$([\d.]+)\s+\/\s+Output:\s+\$([\d.]+)/i, '所有上下文长度 | 输入: $$ $1 / 输出: $$ $2'],
        [/Text • Input: \$([\d.]+) \/ Output: \$([\d.]+)/i, '文本 | 输入：$$ $1，输出：$ $2'],
        [/Dec\s+(\d{1,2}),\s+(\d{4})/, '$2年12月$1日'],
        [/Nov\s+(\d{1,2}),\s+(\d{4})/, '$2年11月$1日'],
        [/Oct\s+(\d{1,2}),\s+(\d{4})/, '$2年10月$1日'],
        [/Apr\s+(\d{1,2}),\s+(\d{4})/, '$2年4月$1日'],
        [/Aug\s+(\d{1,2}),\s+(\d{4})/, '$2年8月$1日'],
        [/Feb\s+(\d{1,2}),\s+(\d{4})/, '$2年2月$1日'],
        [/Jan\s+(\d{1,2}),\s+(\d{4})/, '$2年1月$1日'],
        [/Jul\s+(\d{1,2}),\s+(\d{4})/, '$2年7月$1日'],
        [/Jun\s+(\d{1,2}),\s+(\d{4})/, '$2年6月$1日'],
        [/Mar\s+(\d{1,2}),\s+(\d{4})/, '$2年3月$1日'],
        [/May\s+(\d{1,2}),\s+(\d{4})/, '$2年5月$1日'],
        [/Sep\s+(\d{1,2}),\s+(\d{4})/, '$2年9月$1日'],
      ],
      textRules: [
        ['Upload a photo of yourself and an outfit to see how it looks on you. A virtual fitting room powered by Nano Banana.', '上传您的个人照片和心仪服装，即可轻松预览上身效果。这间虚拟试衣间由 Nano Banana™ 倾力打造。'],
        ['Gemini 2.5 Flash Audio', 'Gemini 2.5 Flash 音频'],
        ['Here are the changes:', '更改内容如下：'],
        ['Character consistency', '角色一致性'],
        ['object consistency', '客观的'],
        [' Running for ', '运行时间 '],
        ['Image Editing', '图像编辑'],
        ['Restored from', '恢复自：'],
        ['Thinking...', '思考中...'],
        ['Saving…..', '保存中...'],
        ['Save app', '保存 App'],
        ['Added', '添加'],
        ['Live', '实时'],
        ['Medium', '中'],
        ['Move', '移动'],
        ['Name', '新明'],
        ['Save', '保存'],
        ['Send', '发送'],
        ['Stop', '停止'],
        ['Talk', '交谈'],
        ['Text', '文本'],
        ['Type', '类型'],
        ['User', '用户'],
        ['All', '全部'],
        ['Cut', '剪切'],
        ['Empty', '空'],
        ['HOT', '热门'],
        ['Off', '关闭'],
        ['Run', '运行'],
        ['High', '高'],
        ['and', '和'],
        ['Low', '低'],
        ['NEW', '新'],
      ],
    },
  },
  'zh-hk': {
    'aistudio.google.com': {
      language: 'zh-hk',
      enabled: true,
      styles: [],
      blockedElements: [],
      jsRules: [],
      regexRules: [
        [/↩\s*Add a new line\s*\s*Alt\s*\+\s*↩\s*Append text without running\s*\s*Ctrl\s*\+\s*↩\s*Run prompt/i, '↩  換行 Alt + ↩  附加文字 (不執行) Ctrl + ↩  執行提示'],
        [/Invalid JSON: SyntaxError: Unexpected token '(.+?)', "(.+?)" is not valid JSON/i, '無效的 JSON 語法錯誤：在「$2」中存在非預期的字元「$1」'],
        [/([<>]=?)\s*(\d+K)\s+tokens\s+•\s+Input:\s+\$([\d.]+)\s+\/\s+Output:\s+\$([\d.]+)/i, '$1$2 Tokens | 輸入: $ $3 / 輸出: $ $4'],
        [/Image \(\*Output per image\) • Input: \$([\d.]+) \/ Output: \$([\d.]+)/i, '圖像 (*每張圖像輸出) | 輸入: $ $1 / 輸出: $ $2'],
        [/All context lengths\s+•\s+Input:\s+\$([\d.]+)\s+\/\s+Output:\s+\$([\d.]+)/i, '所有內容長度 | 輸入: $ $1 / 輸出: $ $2'],
        [/Text • Input: \$([\d.]+) \/ Output: \$([\d.]+)/i, '文字 | 輸入：$ $1，輸出：$ $2'],
        [/Dec\s+(\d{1,2}),\s+(\d{4})/, '$2年12月$1日'],
        [/Nov\s+(\d{1,2}),\s+(\d{4})/, '$2年11月$1日'],
        [/Oct\s+(\d{1,2}),\s+(\d{4})/, '$2年10月$1日'],
        [/Apr\s+(\d{1,2}),\s+(\d{4})/, '$2年4月$1日'],
        [/Aug\s+(\d{1,2}),\s+(\d{4})/, '$2年8月$1日'],
        [/Feb\s+(\d{1,2}),\s+(\d{4})/, '$2年2月$1日'],
        [/Jan\s+(\d{1,2}),\s+(\d{4})/, '$2年1月$1日'],
        [/Jul\s+(\d{1,2}),\s+(\d{4})/, '$2年7月$1日'],
        [/Jun\s+(\d{1,2}),\s+(\d{4})/, '$2年6月$1日'],
        [/Mar\s+(\d{1,2}),\s+(\d{4})/, '$2年3月$1日'],
        [/May\s+(\d{1,2}),\s+(\d{4})/, '$2年5月$1日'],
        [/Sep\s+(\d{1,2}),\s+(\d{4})/, '$2年9月$1日'],
      ],
      textRules: [
        ['Upload a photo of yourself and an outfit to see how it looks on you. A virtual fitting room powered by Nano Banana.', '上傳您的個人照片和一套服飾，即可預覽穿著效果。此虛擬試身室由 Nano Banana™ 提供技術支援。'],
        ['Gemini 2.5 Flash Audio', 'Gemini 2.5 Flash 音訊'],
        ['Here are the changes:', '變更內容如下：'],
        ['Character consistency', '角色一致性'],
        ['object consistency', '物件一致性'],
        [' Running for ', '執行時間 '],
        ['Image Editing', '圖像編輯'],
        ['Restored from', '從...復原：'],
        ['Thinking...', '思考中...'],
        ['Saving…..', '儲存中...'],
        ['Save app', '儲存應用程式'],
        ['Added', '已新增'],
        ['Live', '即時'],
        ['Medium', '中'],
        ['Move', '移動'],
        ['Name', '名稱'],
        ['Save', '儲存'],
        ['Send', '傳送'],
        ['Stop', '停止'],
        ['Talk', '對話'],
        ['Text', '文字'],
        ['Type', '類型'],
        ['User', '用戶'],
        ['All', '全部'],
        ['Cut', '剪下'],
        ['Empty', '空'],
        ['HOT', '熱門'],
        ['Off', '關閉'],
        ['Run', '執行'],
        ['High', '高'],
        ['and', '與'],
        ['Low', '低'],
        ['NEW', '新'],
      ],
    },
  },
  'zh-tw': {
    'aistudio.google.com': {
      language: 'zh-tw',
      enabled: true,
      styles: [],
      blockedElements: [],
      jsRules: [],
      regexRules: [
        [/↩\s*Add a new line\s*\s*Alt\s*\+\s*↩\s*Append text without running\s*\s*Ctrl\s*\+\s*↩\s*Run prompt/i, '↩  換行 Alt + ↩  附加文字 (不執行) Ctrl + ↩  執行提示'],
        [/Invalid JSON: SyntaxError: Unexpected token '(.+?)', "(.+?)" is not valid JSON/i, '無效的 JSON 語法錯誤：在「$2」中存在非預期的字元「$1」'],
        [/([<>]=?)\s*(\d+K)\s+tokens\s+•\s+Input:\s+\$([\d.]+)\s+\/\s+Output:\s+\$([\d.]+)/i, '$1$2 Tokens | 輸入: $ $3 / 輸出: $ $4'],
        [/Image \(\*Output per image\) • Input: \$([\d.]+) \/ Output: \$([\d.]+)/i, '圖片 (*每張圖片輸出) | 輸入: $ $1 / 輸出: $ $2'],
        [/All context lengths\s+•\s+Input:\s+\$([\d.]+)\s+\/\s+Output:\s+\$([\d.]+)/i, '所有內容長度 | 輸入: $ $1 / 輸出: $ $2'],
        [/Text • Input: \$([\d.]+) \/ Output: \$([\d.]+)/i, '文字 | 輸入：$ $1，輸出：$ $2'],
        [/Dec\s+(\d{1,2}),\s+(\d{4})/, '$2年12月$1日'],
        [/Nov\s+(\d{1,2}),\s+(\d{4})/, '$2年11月$1日'],
        [/Oct\s+(\d{1,2}),\s+(\d{4})/, '$2年10月$1日'],
        [/Apr\s+(\d{1,2}),\s+(\d{4})/, '$2年4月$1日'],
        [/Aug\s+(\d{1,2}),\s+(\d{4})/, '$2年8月$1日'],
        [/Feb\s+(\d{1,2}),\s+(\d{4})/, '$2年2月$1日'],
        [/Jan\s+(\d{1,2}),\s+(\d{4})/, '$2年1月$1日'],
        [/Jul\s+(\d{1,2}),\s+(\d{4})/, '$2年7月$1日'],
        [/Jun\s+(\d{1,2}),\s+(\d{4})/, '$2年6月$1日'],
        [/Mar\s+(\d{1,2}),\s+(\d{4})/, '$2年3月$1日'],
        [/May\s+(\d{1,2}),\s+(\d{4})/, '$2年5月$1日'],
        [/Sep\s+(\d{1,2}),\s+(\d{4})/, '$2年9月$1日'],
      ],
      textRules: [
        ['Upload a photo of yourself and an outfit to see how it looks on you. A virtual fitting room powered by Nano Banana.', '上傳您的個人照片和一套服飾，即可預覽穿在您身上的效果。這間虛擬試衣間由 Nano Banana™ 提供技術支援。'],
        ['Gemini 2.5 Flash Audio', 'Gemini 2.5 Flash 音訊'],
        ['Here are the changes:', '變更內容如下：'],
        ['Character consistency', '角色一致性'],
        ['object consistency', '物件一致性'],
        [' Running for ', '執行時間 '],
        ['Image Editing', '圖片編輯'],
        ['Restored from', '從...復原：'],
        ['Thinking...', '思考中...'],
        ['Saving…..', '儲存中...'],
        ['Save app', '儲存應用程式'],
        ['Added', '已新增'],
        ['Live', '即時'],
        ['Medium', '中'],
        ['Move', '移動'],
        ['Name', '名稱'],
        ['Save', '儲存'],
        ['Send', '傳送'],
        ['Stop', '停止'],
        ['Talk', '交談'],
        ['Text', '文字'],
        ['Type', '類型'],
        ['User', '使用者'],
        ['All', '全部'],
        ['Cut', '剪下'],
        ['Empty', '空'],
        ['HOT', '熱門'],
        ['Off', '關閉'],
        ['Run', '執行'],
        ['High', '高'],
        ['and', '與'],
        ['Low', '低'],
        ['NEW', '新'],
      ],
    },
  },
};

const EMBEDDED_SITES = ['aistudio.google.com'];

(() => {
  // src/config/languages.js
  var SUPPORTED_LANGUAGES = [
    { code: 'zh-cn', name: '简体中文-大陆', flag: '🇨🇳' },
    { code: 'zh-hk', name: '繁體中文-香港', flag: '🇭🇰' },
    { code: 'zh-tw', name: '繁體中文-台湾', flag: '🇹🇼' },
  ];
  var SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((lang) => lang.code);

  // src/modules/utils/logger.js
  var LOG_KEY = 'web_translate_debug_mode';
  var isDebugMode = GM_getValue(LOG_KEY, false);
  function updateDebugState(newMode) {
    isDebugMode = newMode;
  }
  function log(...args) {
    if (isDebugMode) {
      console.log('[汉化脚本]', ...args);
    }
  }
  function debug(...args) {
    if (isDebugMode) {
      console.debug('[汉化脚本-DEBUG]', ...args);
    }
  }
  function perf(operation, duration, ...args) {
    if (isDebugMode) {
      if (duration > 5) {
        console.log(`[汉化脚本-PERF] ${operation} 耗时: ${duration}ms`, ...args);
      }
    }
  }
  function translateLog(type, original, translated, element = null) {
    if (isDebugMode) {
      if (original !== translated) {
        const elementInfo = element ? ` 元素: ${element.tagName.toLowerCase()}${element.id ? '#' + element.id : ''}${element.className ? '.' + element.className.replace(/\s+/g, '.') : ''}` : '';
        console.log(`[汉化脚本-TRANSLATE] ${type}:${elementInfo}
  原文: "${original}"
  译文: "${translated}"`);
      }
    }
  }

  // src/modules/ui/menu.js
  var MENU_COMMAND_ID = 'toggle_debug_log_command';
  var OVERRIDE_LANG_KEY = 'web-translate-language-override';
  function setOverrideLanguage(langCode) {
    GM_setValue(OVERRIDE_LANG_KEY, langCode);
    location.reload();
  }
  function clearOverrideLanguage() {
    GM_setValue(OVERRIDE_LANG_KEY, '');
    location.reload();
  }
  function toggleDebugMode() {
    const newMode = !isDebugMode;
    GM_setValue(LOG_KEY, newMode);
    updateDebugState(newMode);
    location.reload();
  }
  function registerMenuCommands() {
    const debugStatus = isDebugMode ? '开启' : '关闭';
    GM_registerMenuCommand(`切换调试日志 (当前: ${debugStatus})`, toggleDebugMode, { id: MENU_COMMAND_ID });
    if (isDebugMode) {
      const currentOverride = GM_getValue(OVERRIDE_LANG_KEY, '');
      GM_registerMenuCommand('--- 语言调试菜单 ---', () => {});
      SUPPORTED_LANGUAGES.forEach((lang) => {
        const isCurrent = currentOverride === lang.code;
        const menuText = `${isCurrent ? '✅' : '➡️'} 强制语言: ${lang.name}`;
        GM_registerMenuCommand(menuText, () => setOverrideLanguage(lang.code));
      });
      GM_registerMenuCommand('🔄 清除语言强制 (恢复默认)', clearOverrideLanguage);
    }
  }
  function initializeMenu() {
    registerMenuCommands();
  }

  // src/modules/ui/anti-flicker.js
  var STYLE_ID = 'anti-flicker-style';
  function injectAntiFlickerStyle() {
    document.documentElement.classList.add('translation-in-progress');
    const antiFlickerStyle = document.createElement('style');
    antiFlickerStyle.id = STYLE_ID;
    const styleContent = `
        /* 在翻译进行中时，隐藏body，但保持加载指示器可见 */
        html.translation-in-progress body {
            visibility: hidden !important;
            opacity: 0 !important;
        }
        html.translation-complete body {
            visibility: visible !important;
            opacity: 1 !important;
            transition: opacity 0.1s ease-in !important;
        }
        html.translation-in-progress [class*="load"],
        html.translation-in-progress [class*="spin"],
        html.translation-in-progress [id*="load"],
        html.translation-in-progress [id*="spin"],
        html.translation-in-progress .loader,
        html.translation-in-progress .spinner,
        html.translation-in-progress .loading {
            visibility: visible !important;
            opacity: 1 !important;
        }
    `;
    antiFlickerStyle.appendChild(document.createTextNode(styleContent));
    const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    head.insertBefore(antiFlickerStyle, head.firstChild);
  }
  function removeAntiFlickerStyle() {
    document.documentElement.classList.remove('translation-in-progress');
    document.documentElement.classList.add('translation-complete');
    setTimeout(() => {
      const styleElement = document.getElementById(STYLE_ID);
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    }, 100);
  }

  // src/config.js
  var BLOCKS_ALL_TRANSLATION = /* @__PURE__ */ new Set(['script', 'style', 'pre', 'code']);
  var BLOCKS_CONTENT_ONLY = /* @__PURE__ */ new Set(['textarea', 'input']);
  var ALL_UNTRANSLATABLE_TAGS = /* @__PURE__ */ new Set([...BLOCKS_ALL_TRANSLATION, ...BLOCKS_CONTENT_ONLY]);
  var attributesToTranslate = ['placeholder', 'title', 'aria-label', 'alt', 'mattooltip'];
  var BLOCKED_CSS_CLASSES = /* @__PURE__ */ new Set(['notranslate']);

  // src/modules/core/translator.js
  function createTranslator(textMap, regexArr, blockedSelectors = []) {
    let textTranslationMap = textMap;
    let regexRules = regexArr;
    let translationCache = /* @__PURE__ */ new Map();
    let translatedElements = /* @__PURE__ */ new WeakSet();
    const blockedElements = /* @__PURE__ */ new Set([...ALL_UNTRANSLATABLE_TAGS]);
    const blockedElementSelectors = blockedSelectors || [];
    function isElementBlocked(element) {
      const tagName = element.tagName?.toLowerCase();
      if (blockedElements.has(tagName)) {
        return true;
      }
      if (element.classList) {
        for (const className of element.classList) {
          if (BLOCKED_CSS_CLASSES.has(className)) {
            return true;
          }
        }
      }
      for (const selector of blockedElementSelectors) {
        if (element.matches && element.matches(selector)) {
          return true;
        }
      }
      return false;
    }
    function translateText(text) {
      if (!text || typeof text !== 'string') return text;
      const originalText = text;
      if (translationCache.has(originalText)) {
        return translationCache.get(originalText);
      }
      const trimmedText = text.trim();
      if (trimmedText === '') return text;
      let translatedText = text;
      let hasChanged = false;
      const mapTranslation = textTranslationMap.get(trimmedText);
      if (mapTranslation) {
        const leadingSpace = originalText.match(/^\s*/)[0] || '';
        const trailingSpace = originalText.match(/\s*$/)[0] || '';
        translatedText = leadingSpace + mapTranslation + trailingSpace;
        hasChanged = true;
        translateLog('文本映射', trimmedText, mapTranslation);
      } else {
        for (const [match, replacement] of regexRules) {
          const newText = translatedText.replace(match, replacement);
          if (newText !== translatedText) {
            translatedText = newText;
            hasChanged = true;
            translateLog('正则表达式', originalText, translatedText);
          }
        }
      }
      if (hasChanged) {
        translationCache.set(originalText, translatedText);
      }
      return translatedText;
    }
    function translateElementContent(element) {
      const tagName = element.tagName?.toLowerCase();
      const startTime = performance.now();
      if (!element || isElementBlocked(element) || element.isContentEditable) {
        return false;
      }
      if (element.querySelector(Array.from(blockedElements).join(','))) {
        return false;
      }
      const fullText = element.textContent?.trim();
      if (!fullText) {
        return false;
      }
      const translation = textTranslationMap.get(fullText);
      if (!translation) {
        return false;
      }
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => (node.nodeValue?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
      });
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      if (textNodes.length === 0) {
        return false;
      }
      textNodes[0].nodeValue = translation;
      for (let i = 1; i < textNodes.length; i++) {
        textNodes[i].nodeValue = '';
      }
      const duration = performance.now() - startTime;
      perf('元素内容翻译', duration, `${tagName}`);
      log('整段翻译:', `"${fullText}"`, '->', `"${translation}"`);
      return true;
    }
    function translateElement(element) {
      if (!element || translatedElements.has(element) || !(element instanceof Element)) return;
      const tagName = element.tagName.toLowerCase();
      const startTime = performance.now();
      if (isElementBlocked(element) || element.isContentEditable) {
        translatedElements.add(element);
        return;
      }
      const isContentBlocked = BLOCKS_CONTENT_ONLY.has(tagName);
      if (!isContentBlocked) {
        if (translateElementContent(element)) {
          translatedElements.add(element);
          const duration2 = performance.now() - startTime;
          perf('元素翻译完成', duration2, `${tagName} (整段)`);
          return;
        }
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
          acceptNode: function (node) {
            if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
            let parent = node.parentElement;
            while (parent) {
              if (isElementBlocked(parent) || parent.isContentEditable) {
                return NodeFilter.FILTER_REJECT;
              }
              if (parent === element) break;
              parent = parent.parentElement;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        });
        const nodesToTranslate = [];
        while (walker.nextNode()) nodesToTranslate.push(walker.currentNode);
        if (nodesToTranslate.length > 0) {
          let translatedCount = 0;
          nodesToTranslate.forEach((textNode) => {
            const originalText = textNode.nodeValue;
            const translatedText = translateText(originalText);
            if (originalText !== translatedText) {
              textNode.nodeValue = translatedText;
              translatedCount++;
            }
          });
          if (translatedCount > 0) {
            debug(`翻译了 ${tagName} 中的 ${translatedCount} 个文本节点`);
          }
        }
      }
      const elementsWithAttributes = element.matches(`[${attributesToTranslate.join('], [')}]`) ? [element, ...element.querySelectorAll(`[${attributesToTranslate.join('], [')}]`)] : [...element.querySelectorAll(`[${attributesToTranslate.join('], [')}]`)];
      if (elementsWithAttributes.length > 0) {
        let translatedAttrCount = 0;
        elementsWithAttributes.forEach((el) => {
          let current = el;
          let isBlockedByContainer = false;
          while (current && current !== element.parentElement) {
            if (isElementBlocked(current)) {
              isBlockedByContainer = true;
              break;
            }
            if (current === element) break;
            current = current.parentElement;
          }
          if (isBlockedByContainer) {
            return;
          }
          attributesToTranslate.forEach((attr) => {
            if (el.hasAttribute(attr)) {
              const originalValue = el.getAttribute(attr);
              const translatedValue = translateText(originalValue);
              if (originalValue !== translatedValue) {
                el.setAttribute(attr, translatedValue);
                translatedAttrCount++;
                translateLog(`属性[${attr}]`, originalValue, translatedValue);
              }
            }
          });
        });
        if (translatedAttrCount > 0) {
          debug(`翻译了 ${translatedAttrCount} 个属性`);
        }
      }
      if (element.shadowRoot) {
        translateElement(element.shadowRoot);
      }
      translatedElements.add(element);
      const duration = performance.now() - startTime;
      perf('元素翻译完成', duration, `${tagName}`);
    }
    return {
      translate: translateElement,
      resetState: () => {
        translationCache.clear();
        translatedElements = /* @__PURE__ */ new WeakSet();
        log('翻译器状态已重置');
      },
      // 允许 observer 删除单个元素的翻译记录
      deleteElement: (element) => {
        translatedElements.delete(element);
      },
    };
  }

  // src/modules/core/observers.js
  function initializeObservers(translator) {
    let translationTimer;
    let pendingNodes = /* @__PURE__ */ new Set();
    let lastModelInfo = '';
    function detectModelChange() {
      const modelElements = document.querySelectorAll('.model-name, .model-info, [class*="model"]');
      const currentModelInfo = Array.from(modelElements)
        .map((el) => el.textContent?.trim())
        .join('|');
      if (currentModelInfo && currentModelInfo !== lastModelInfo) {
        lastModelInfo = currentModelInfo;
        log('检测到模型切换:', currentModelInfo);
        translator.resetState();
        setTimeout(() => {
          if (document.body) {
            translator.translate(document.body);
          }
        }, 100);
        return true;
      }
      return false;
    }
    function scheduleTranslation() {
      clearTimeout(translationTimer);
      translationTimer = setTimeout(() => {
        const hasModelChange = detectModelChange();
        if (pendingNodes.size > 0) {
          const nodesToProcess = Array.from(pendingNodes);
          pendingNodes.clear();
          if (nodesToProcess.length > 5) {
            debug(`处理 ${nodesToProcess.length} 个待翻译节点`);
          }
          const startTime = performance.now();
          nodesToProcess.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              translator.translate(node);
            } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
              translator.translate(node.parentElement);
            }
          });
          const duration = performance.now() - startTime;
          perf('批量翻译', duration, `${nodesToProcess.length} 个节点`);
        }
        if (hasModelChange && pendingNodes.size === 0) {
          if (document.body) {
            translator.translate(document.body);
          }
        }
      }, 0);
    }
    const mainObserver = new MutationObserver((mutations) => {
      const dirtyRoots = /* @__PURE__ */ new Set();
      let attributeChanges = 0;
      let childListChanges = 0;
      let textChanges = 0;
      for (const mutation of mutations) {
        let target = null;
        if (mutation.type === 'childList') {
          childListChanges++;
          target = mutation.target;
        } else if (mutation.type === 'attributes') {
          attributeChanges++;
          target = mutation.target;
        } else if (mutation.type === 'characterData') {
          textChanges++;
          target = mutation.target.parentElement;
        }
        if (target instanceof Element) dirtyRoots.add(target);
      }
      if (dirtyRoots.size > 5) {
        debug(`检测到 DOM 变化: 子节点变化=${childListChanges}, 属性变化=${attributeChanges}, 文本变化=${textChanges}, 影响元素=${dirtyRoots.size}`);
      }
      if (dirtyRoots.size > 0) {
        for (const root of dirtyRoots) {
          translator.deleteElement(root);
          const descendants = root.getElementsByTagName('*');
          for (let i = 0; i < descendants.length; i++) {
            translator.deleteElement(descendants[i]);
          }
          pendingNodes.add(root);
        }
        scheduleTranslation();
      }
    });
    let currentUrl = window.location.href;
    const pageObserver = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        log('检测到页面导航，将重新翻译:', currentUrl);
        translator.resetState();
        lastModelInfo = '';
        setTimeout(() => {
          log('开始重新翻译新页面内容...');
          if (document.body) translator.translate(document.body);
        }, 300);
      }
    });
    const modelChangeObserver = new MutationObserver((mutations) => {
      let shouldCheckModel = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node;
              if (element.classList?.contains('mat-mdc-dialog-component-host') || element.querySelector?.('.model-name, .model-info') || element.classList?.contains('model-name') || element.classList?.contains('model-info')) {
                shouldCheckModel = true;
              }
            }
          });
        }
        if (mutation.type === 'characterData') {
          const parent = mutation.target.parentElement;
          if (parent?.classList?.contains('model-name') || parent?.classList?.contains('model-info') || parent?.querySelector?.('.model-name, .model-info')) {
            shouldCheckModel = true;
          }
        }
      });
      if (shouldCheckModel) {
        setTimeout(() => detectModelChange(), 50);
      }
    });
    mainObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label', 'alt', 'mattooltip'],
      characterData: true,
    });
    pageObserver.observe(document.body, { childList: true, subtree: true });
    modelChangeObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    window.forceRetranslate = function () {
      log('强制重新翻译已触发。');
      translator.resetState();
      lastModelInfo = '';
      if (document.body) {
        translator.translate(document.body);
      }
    };
    log('监听器初始化完成。');
  }

  // src/modules/core/translationInitializer.js
  function initializeTranslation(siteDictionary, createTranslator2, removeAntiFlickerStyle2, initializeObservers2, log2) {
    const { language, styles: cssRules = [], blockedElements = [], jsRules = [], regexRules = [], textRules = [] } = siteDictionary;
    log2(`开始初始化翻译流程，使用语言: ${language || 'unknown'}`);
    const textTranslationMap = /* @__PURE__ */ new Map();
    for (const rule of textRules) {
      if (Array.isArray(rule) && rule.length === 2 && typeof rule[0] === 'string' && typeof rule[1] === 'string') {
        textTranslationMap.set(rule[0].trim(), rule[1]);
      }
    }
    if (textTranslationMap.size > 0) {
      log2(`加载了 ${textTranslationMap.size} 条文本翻译规则`);
    }
    if (cssRules.length > 0) {
      const customStyleElement = document.createElement('style');
      customStyleElement.id = 'web-translate-custom-styles';
      customStyleElement.appendChild(document.createTextNode(cssRules.join('\n')));
      const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
      head.appendChild(customStyleElement);
      log2(`注入了 ${cssRules.length} 条自定义CSS样式`);
    }
    if (jsRules.length > 0) {
      const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
      let executedScripts = 0;
      for (const scriptText of jsRules) {
        if (typeof scriptText === 'string' && scriptText.trim()) {
          const scriptElement = document.createElement('script');
          scriptElement.type = 'text/javascript';
          scriptElement.appendChild(document.createTextNode(scriptText));
          head.appendChild(scriptElement);
          executedScripts++;
        }
      }
      if (executedScripts > 0) {
        log2(`执行了 ${executedScripts} 条自定义JS脚本`);
      }
    }
    const translator = createTranslator2(textTranslationMap, regexRules, blockedElements);
    function startTranslation() {
      if (document.body) {
        initializeFullTranslation();
      } else {
        new MutationObserver((_mutations, obs) => {
          if (document.body) {
            obs.disconnect();
            initializeFullTranslation();
          }
        }).observe(document.documentElement, { childList: true });
      }
    }
    function initializeFullTranslation() {
      log2('开始执行初次全文翻译...');
      const startTime = performance.now();
      translator.translate(document.body);
      const duration = performance.now() - startTime;
      log2(`初次翻译完成。使用语言: ${language || 'unknown'}, 耗时: ${duration.toFixed(2)}ms`);
      removeAntiFlickerStyle2();
      initializeObservers2(translator);
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startTranslation);
    } else {
      startTranslation();
    }
  }

  // src/main-cdn.js
  (async function () {
    'use strict';
    initializeMenu();
    injectAntiFlickerStyle();
    function getUserLanguage() {
      const overrideLang = GM_getValue('web-translate-language-override', '');
      if (overrideLang && SUPPORTED_LANGUAGE_CODES.includes(overrideLang)) {
        return overrideLang;
      }
      const storedLang = localStorage.getItem('web-translate-language');
      if (storedLang && SUPPORTED_LANGUAGE_CODES.includes(storedLang)) {
        return storedLang;
      }
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang) {
        const lowerBrowserLang = browserLang.toLowerCase();
        if (SUPPORTED_LANGUAGE_CODES.includes(lowerBrowserLang)) {
          return lowerBrowserLang;
        }
        const partialMatch = SUPPORTED_LANGUAGE_CODES.find((code) => lowerBrowserLang.startsWith(code));
        if (partialMatch) {
          return partialMatch;
        }
      }
      return 'zh-cn';
    }
    async function fetchWithFallbacks(urls) {
      for (const url of urls) {
        try {
          return await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: 'GET',
              url,
              onload: (response) => {
                if (response.status >= 200 && response.status < 300) {
                  resolve(response.responseText);
                } else {
                  reject(new Error(`请求失败，状态码: ${response.status}`));
                }
              },
              onerror: (error2) => reject(new Error(`网络请求出错: ${error2.statusText}`)),
              ontimeout: () => reject(new Error('请求超时')),
            });
          });
        } catch (error2) {
          log(`从 ${url} 加载失败: ${error2.message}`, 'error');
        }
      }
      return null;
    }
    async function loadTranslationScript(hostname2, userLang2) {
      const repoUser = 'qing90bing';
      const repoName = 'qing_web-translate-script';
      const cdnUrls = [`https://cdn.jsdelivr.net/gh/${repoUser}/${repoName}@latest/src/translations/${userLang2}/${hostname2}.js`, `https://raw.githubusercontent.com/${repoUser}/${repoName}/main/src/translations/${userLang2}/${hostname2}.js`];
      log(`正在尝试从 CDN 加载翻译文件: ${hostname2}.js for ${userLang2}...`);
      const scriptText = await fetchWithFallbacks(cdnUrls);
      if (!scriptText) {
        log(`无法从所有 CDN 源获取翻译文件: ${hostname2}.js`, 'error');
        return null;
      }
      let blobUrl = '';
      try {
        const blob = new Blob([scriptText], { type: 'text/javascript' });
        blobUrl = URL.createObjectURL(blob);
        const module = await import(blobUrl);
        const dictionary = Object.values(module)[0];
        if (dictionary && typeof dictionary === 'object') {
          log(`成功从 CDN 加载并解析翻译: ${hostname2}.js`, 'success');
          return dictionary;
        }
        log(`从 CDN 加载的脚本没有有效的导出对象: ${hostname2}.js`, 'error');
        return null;
      } catch (e) {
        log(`执行从 CDN 加载的翻译脚本时出错: ${e.message}`, 'error');
        return null;
      } finally {
        if (blobUrl) {
          URL.revokeObjectURL(blobUrl);
        }
      }
    }
    const hostname = window.location.hostname;
    const userLang = getUserLanguage();
    let siteDictionary = null;
    if (typeof EMBEDDED_TRANSLATIONS !== 'undefined' && typeof EMBEDDED_SITES !== 'undefined') {
      if (EMBEDDED_TRANSLATIONS[userLang] && EMBEDDED_TRANSLATIONS[userLang][hostname]) {
        log(`找到 ${hostname} 的内联翻译 (${userLang})。`);
        siteDictionary = EMBEDDED_TRANSLATIONS[userLang][hostname];
      } else if (EMBEDDED_SITES.includes(hostname)) {
        log(`网站 ${hostname} 在嵌入列表中，但未找到 ${userLang} 的翻译。显示原始网页。`);
        removeAntiFlickerStyle();
        return;
      }
    }
    if (!siteDictionary) {
      log(`未找到内联翻译，尝试从 CDN 加载...`);
      siteDictionary = await loadTranslationScript(hostname, userLang);
    }
    if (!siteDictionary || !siteDictionary.enabled) {
      if (siteDictionary && !siteDictionary.enabled) {
        log(`网站 ${hostname} 的翻译词典已被禁用。`);
      } else {
        log(`未找到或加载失败 ${hostname} 的翻译词典。显示原始网页。`);
      }
      removeAntiFlickerStyle();
      return;
    }
    initializeTranslation(siteDictionary, createTranslator, removeAntiFlickerStyle, initializeObservers, log);
  })();
})();
