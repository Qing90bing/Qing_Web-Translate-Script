// ==UserScript==
// @name         WEB 中文汉化插件 - CDN
// @name:en-US   WEB Chinese Translation Plugin - CDN
// @namespace    https://github.com/Qing90bing/Qing_Web-Translate-Script
// @version      1.0.41-2025-09-28-cdn
// @description  人工翻译一些网站为中文,减少阅读压力,该版本使用的是CDN,自动更新:)
// @description:en-US   Translate some websites into Chinese to reduce reading pressure, this version uses CDN, automatically updated :)
// @license      MIT
// @copyright    2025, Qing90bing
// @author       Qing90bing
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiID8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+Cjxzdmcgd2lkdGg9IjcwNnB0IiBoZWlnaHQ9IjcwN3B0IiB2aWV3Qm94PSIwIDAgNzA2IDcwNyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBpZD0iIzExN2ZlOWZmIj4KPHBhdGggZmlsbD0iIzExN2ZlOSIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gMTg3LjQ3IDAuMDAgTCA1MTguNTMgMC4wMCBDIDU1NC4xOSAzLjEwIDU4OS40OSAxNC40MyA2MTguODkgMzUuMTMgQyA2NDYuOTMgNTQuMjMgNjcwLjA2IDgwLjUxIDY4NS4wMyAxMTAuOTggQyA2OTcuMzAgMTM0LjcwIDcwMy4xNyAxNjEuMTUgNzA2LjAwIDE4Ny41NiBMIDcwNi4wMCA1MTkuNTMgQyA3MDMuNDYgNTQ4LjY4IDY5NS4yNyA1NzcuNDEgNjgxLjE1IDYwMy4wOSBDIDY1My40MCA2NTQuMDAgNjAyLjM5IDY5MS4zMCA1NDUuNTIgNzAyLjQ3IEMgNTM1LjIxIDcwNC4zMSA1MjQuODMgNzA1LjcyIDUxNC40NCA3MDcuMDAgTCAxOTEuNDggNzA3LjAwIEMgMTY2LjI3IDcwNC44NyAxNDEuMTUgNjk5LjQxIDExOC4wOCA2ODguODYgQyA4NC4zMCA2NzMuNTIgNTQuNDcgNjQ5LjA0IDM0LjEwIDYxNy45MSBDIDEzLjg3IDU4OS4wMiAzLjQ3IDU1NC4zNiAwLjAwIDUxOS41MSBMIDAuMDAgMTg3LjU2IEMgMi43NSAxNjIuNjQgNy45MCAxMzcuNjMgMTkuMDUgMTE1LjAyIEMgMzQuNTAgODEuNzcgNTkuNTYgNTMuMzEgOTAuMDggMzMuMDggQyAxMTguODkgMTMuNjcgMTUzLjAwIDMuMDAgMTg3LjQ3IDAuMDAgTSAzMDUuMjAgMTc5LjQyIEMgMzA1LjA2IDE4Ny4wNyAzMDUuMDEgMTk0LjcyIDMwNS4wMiAyMDIuMzcgQyAyOTEuMDYgMjA2LjU4IDI3Ni4wNiAyMDYuNTAgMjYyLjYxIDIxMi41NCBDIDI0Mi4yNiAyMjAuNzIgMjIyLjE1IDIzMS44OCAyMDguODQgMjQ5Ljg0IEMgMjE5LjUwIDI1MS40OCAyMzAuMDYgMjUzLjkwIDI0MC43NiAyNTUuMjAgQyAyNTEuOTUgMjQ5LjIyIDI2Mi4xNSAyNDAuODggMjc0LjU4IDIzNy40NSBDIDI4NC42NSAyMzQuNjQgMjk1LjQwIDIzMC43NyAzMDUuOTYgMjMzLjMwIEMgMzA2LjA1IDI0MC42MSAzMDYuMjggMjQ3LjkyIDMwNi43NCAyNTUuMjMgQyAzMjMuNzMgMjQyLjk5IDM0MC4yMCAyMzAuMDEgMzU2LjM0IDIxNi42OCBDIDM0NS45NyAyMDcuNTcgMzM0LjQ3IDE5OS45MCAzMjMuNTYgMTkxLjQ4IEMgMzE3LjU3IDE4Ny4yNiAzMTEuNjggMTgyLjg2IDMwNS4yMCAxNzkuNDIgTSA0MzQuMTUgMjI0LjE2IEMgNDI2LjIwIDIzMy40NiA0MTguNjggMjQzLjgyIDQxNS4zNCAyNTUuNzggQyA0MjkuMDMgMjU4LjYwIDQ0My4wMiAyNTkuODUgNDU2Ljk4IDI2MC4yMyBDIDQ1Ny4wMiAyNDMuMjMgNDU3LjEwIDIyNi4yMyA0NTYuODEgMjA5LjI0IEMgNDQ4LjM4IDIxMi42OCA0NDAuMDMgMjE3LjAwIDQzNC4xNSAyMjQuMTYgTSA0NjkuMTMgMjA5LjE4IEMgNDY4Ljg2IDIyNi4wOSA0NjguODUgMjQzLjAxIDQ2OS4zMyAyNTkuOTIgQyA0NzkuOTkgMjU5LjgyIDQ5MC42NCAyNTguOTYgNTAxLjE4IDI1Ny4zNiBDIDUwNC41NCAyNTYuNzAgNTA4LjQ4IDI1Ni41NyA1MTEuMjUgMjU0LjIwIEMgNTAzLjY0IDIzNC44NCA0ODkuOTMgMjE1LjM4IDQ2OS4xMyAyMDkuMTggTSA0MTAuNzIgMjE4LjczIEMgMzk4LjE3IDIyNS4zNSAzODUuNDUgMjMyLjYzIDM3Ni4zMSAyNDMuNzQgQyAzODQuODQgMjQ3Ljc0IDM5My44NyAyNTAuNTggNDAyLjg4IDI1My4zMiBDIDQwOC44MiAyMzguMDMgNDE4LjIxIDIyNC40NCA0MjkuMTQgMjEyLjMwIEMgNDIyLjYyIDIxMy4xMSA0MTYuNjUgMjE2LjEwIDQxMC43MiAyMTguNzMgTSA0OTcuNjQgMjEyLjYxIEMgNTA3LjE2IDIyNC43NiA1MTYuNTIgMjM3LjA5IDUyMy4wNiAyNTEuMTcgQyA1MzIuMzUgMjQ5LjM4IDU0MS42NCAyNDcuMzEgNTUwLjQ5IDI0My44OSBDIDUzNi40NiAyMjguNjQgNTE3Ljc4IDIxNy41MyA0OTcuNjQgMjEyLjYxIE0gMzY2LjM5IDI1My42NiBDIDM1MS4wNSAyNzQuMzggMzQwLjMzIDI5OS4wNiAzMzkuNzcgMzI1LjEyIEMgMzU2LjExIDMyNi4wOSAzNzIuNDggMzI0Ljk3IDM4OC44NCAzMjUuMTQgQyAzOTAuMDEgMzA0LjUyIDM5Mi42NSAyODMuOTcgMzk4LjI3IDI2NC4wNSBDIDM4Ny40MiAyNjEuMjcgMzc3LjE2IDI1Ni42NiAzNjYuMzkgMjUzLjY2IE0gNTM5LjQ1IDI2MC41NCBDIDUyNS43NiAyNjEuNjQgNTEyLjA4IDI2NS42NiA1MDEuMTEgMjc0LjE2IEMgNDczLjczIDI5Mi44OSA0NjIuMzQgMzMxLjYwIDQ3Ni4wNyAzNjEuOTcgQyA0ODguMTIgMzkyLjU3IDUyMi45MiA0MTAuNjIgNTU0Ljk3IDQwNi4wNSBDIDU4NC4wMyA0MDMuOTIgNjA5Ljg5IDM4MS43MiA2MTcuODggMzUzLjk1IEMgNjIzLjE4IDMzOC41MSA2MjEuMTcgMzIxLjQxIDYxNS42OCAzMDYuMzEgQyA2MDQuMDYgMjc2LjUwIDU3MS4yOCAyNTYuNjQgNTM5LjQ1IDI2MC41NCBNIDEwOS4yNyAzMTEuMjYgQyA4OC4zOSAzMzYuNDQgODUuNjYgMzczLjI4IDk4LjExIDQwMi45MCBDIDEwNC43MCA0MTcuODcgMTE1LjI5IDQzMC43OSAxMjcuODkgNDQxLjEzIEMgMTM0LjE5IDQ0NS4wMCAxMzAuODUgNDUzLjEzIDEzMC45NyA0NTguOTcgQyAxMzAuNDUgNDY5Ljg3IDEyNS4yMSA0NzkuNjIgMTIxLjk0IDQ4OS44MiBDIDEzMC4yNyA0ODkuMjggMTM4LjUyIDQ4Ny41OCAxNDYuMjQgNDg0LjMxIEMgMTU3LjQ4IDQ4MC4yMCAxNjYuNDMgNDcyLjAxIDE3NS4xNiA0NjQuMTMgQyAyMjEuODAgNDc2LjQ0IDI3NS43OCA0NTguNDcgMzAyLjk1IDQxNy45NyBDIDMyMS43NCAzOTAuNzcgMzIyLjU2IDM1My40NyAzMDcuNjQgMzI0LjM2IEMgMjg5LjU4IDI5MC41OCAyNTIuODcgMjY4LjYyIDIxNC45NiAyNjYuMDYgQyAxNzUuMjAgMjYxLjk4IDEzMi45MyAyNzguNDQgMTA5LjI3IDMxMS4yNiBNIDQwOS44MyAyNjYuODUgQyA0MDQuMDggMjg1LjM1IDQwMS41MiAzMDQuNTQgNDAwLjA4IDMyMy43OSBDIDQwMC43OSAzMjQuNDEgNDAxLjUxIDMyNS4wMyA0MDIuMjQgMzI1LjY1IEMgNDIwLjczIDMyNC43MCA0MzkuMjUgMzI1LjIyIDQ1Ny43NSAzMjQuNjYgQyA0NTYuNTAgMzA3LjI1IDQ1Ny4zMCAyODkuNzggNDU2LjY3IDI3Mi4zNiBDIDQ0MC45NCAyNzEuNjEgNDI1LjMxIDI2OS43MSA0MDkuODMgMjY2Ljg1IE0gNDY5LjA4IDI3Mi40MSBDIDQ2OS4zMCAyNzguNTEgNDY5LjU4IDI4NC42MiA0NzAuMjMgMjkwLjcwIEMgNDc1LjcxIDI4NC41MyA0ODAuNjkgMjc3Ljk0IDQ4NS42MCAyNzEuMzIgQyA0ODAuMDkgMjcxLjYxIDQ3NC41OCAyNzIuMDEgNDY5LjA4IDI3Mi40MSBNIDMzOS44MSAzMzcuNzEgQyAzNDEuMjQgMzYzLjY1IDM1MC41MCAzODkuMTYgMzY3LjE2IDQwOS4yMSBDIDM3Ny42MCA0MDUuMTcgMzg4LjE3IDQwMS41MiAzOTguODYgMzk4LjE5IEMgMzkyLjQwIDM3OC42OCAzODkuNDYgMzU4LjE0IDM4OC43MyAzMzcuNjQgQyAzNzIuNDIgMzM4LjExIDM1Ni4xMSAzMzcuMjYgMzM5LjgxIDMzNy43MSBNIDQwMi4yMSAzMzcuMTggQyA0MDEuNTUgMzM3Ljg2IDQwMC44OSAzMzguNTQgNDAwLjIzIDMzOS4yMyBDIDQwMS42MiAzNTguNTQgNDA0LjUwIDM3Ny44MCA0MTAuODYgMzk2LjE2IEMgNDI1Ljk1IDM5Mi4zNCA0NDEuNDMgMzkwLjUyIDQ1Ni45NiAzODkuODAgQyA0NTYuODMgMzcyLjY1IDQ1Ny42MCAzNTUuNDkgNDU2LjcwIDMzOC4zNyBDIDQ1Ni40MyAzMzguMTAgNDU1Ljg5IDMzNy41NSA0NTUuNjIgMzM3LjI3IEMgNDM3LjgzIDMzNS45NSA0MjAuMDEgMzM4LjE2IDQwMi4yMSAzMzcuMTggTSA0NjkuODEgMzc1LjQwIEMgNDY5LjM1IDM4MC4xNyA0NjkuMzEgMzg0Ljk1IDQ2OS4xNyAzODkuNzUgQyA0NzIuODUgMzg5Ljk3IDQ3Ni41NSAzOTAuMjIgNDgwLjI0IDM5MC4yNiBDIDQ3Ny4wMiAzODUuMTMgNDczLjUzIDM4MC4xNyA0NjkuODEgMzc1LjQwIE0gNDE0LjgwIDQwNy41OSBDIDQyMC42OCA0MTkuMzUgNDI2LjM5IDQzMS43MiA0MzYuMTkgNDQwLjgxIEMgNDQyLjA0IDQ0Ni42OCA0NDkuMTcgNDUxLjgxIDQ1Ny40NyA0NTMuMzQgQyA0NTYuODggNDM2LjI2IDQ1Ny4xMyA0MTkuMTcgNDU2LjY2IDQwMi4wOSBDIDQ0Mi41OSA0MDIuNjIgNDI4LjQzIDQwMy44OCA0MTQuODAgNDA3LjU5IE0gNDY5LjY3IDQwMS43OSBDIDQ2OC4zNyA0MTguOTAgNDY4Ljg5IDQzNi4xMiA0NjkuNDggNDUzLjI1IEMgNDgxLjEzIDQ1MS4xMCA0ODkuODEgNDQxLjczIDQ5Ny4wMSA0MzMuMDAgQyA1MDEuNTIgNDI2LjEzIDUwNy4wOSA0MTkuMzAgNTA5LjAzIDQxMS4xOCBDIDQ5OC40NiA0MDEuNDQgNDgyLjk3IDQwMi44MyA0NjkuNjcgNDAxLjc5IE0gMzc2LjI1IDQxOC43MyBDIDM5MC40OCA0MzMuNTMgNDA4LjU5IDQ0NC44NyA0MjguNTMgNDUwLjA3IEMgNDI0LjExIDQ0Mi41MSA0MTcuNDggNDM2LjUzIDQxMy4wMiA0MjguOTkgQyA0MDkuMDAgNDIzLjA1IDQwNi40OSA0MTYuMjkgNDAzLjYxIDQwOS43OCBDIDM5NC4yMSA0MTEuNzUgMzg0Ljc1IDQxNC4xNiAzNzYuMjUgNDE4LjczIE0gNTIwLjc5IDQxNS4yMyBDIDUxNS4yMiA0MjcuNzAgNTA2LjM0IDQzOC4xNCA0OTguNTIgNDQ5LjE5IEMgNTA3LjQ2IDQ0Ny4yNiA1MTUuODQgNDQzLjMxIDUyMy43MiA0MzguNzQgQyA1MzIuOTcgNDMzLjI2IDU0Mi4xMyA0MjcuMzQgNTQ5LjM5IDQxOS4yOSBDIDUzOS44NCA0MTguMTIgNTMwLjI2IDQxNi45NyA1MjAuNzkgNDE1LjIzIE0gMzQ1LjAyIDQ3Ny45NiBDIDMyMS41MSA0NzkuNjQgMjk4LjIzIDQ3Mi41NSAyNzcuOTcgNDYwLjk5IEMgMjY4LjgxIDQ2Ni4zNCAyNTkuMTcgNDcwLjc5IDI0OS41OSA0NzUuMzEgQyAyNjguMDAgNDkxLjg0IDI5Mi41NiA0OTkuNTUgMzE2LjUzIDUwMy41NyBDIDM0MC40OCA1MDYuODMgMzY1LjIxIDUwNS4wOSAzODguMTMgNDk3LjIxIEMgNDA2Ljg2IDQ5MC42MyA0MjUuMzggNDgxLjIyIDQzOC43MSA0NjYuMTkgQyA0MjguNTEgNDYyLjU4IDQxNy42OSA0NjAuODYgNDA3Ljg0IDQ1Ni4yNSBDIDM4OS4xNCA0NjguNjEgMzY3LjM5IDQ3Ni4zOCAzNDUuMDIgNDc3Ljk2IFoiIC8+CjxwYXRoIGZpbGw9IiMxMTdmZTkiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDUzMC4xNiAyOTUuMDggQyA1MzAuNjUgMjkwLjI0IDUzNy4zNyAyODguNDIgNTQxLjA1IDI5MC45MyBDIDU0Ny4yNCAyOTMuNzQgNTQ3LjMzIDMwMS43NyA1NTIuMDMgMzA1Ljk1IEMgNTYwLjYwIDMwNy43NSA1NjkuNjUgMzA2LjQyIDU3OC4zNCAzMDcuNzkgQyA1ODIuNjUgMzA5LjA2IDU4NS4xMiAzMTQuNzMgNTgyLjY1IDMxOC42NSBDIDU4MC4xNSAzMjMuMDUgNTczLjg2IDMyMS4zOCA1NjkuODUgMzIyLjkyIEMgNTY3LjIxIDMzMy44NCA1NjEuNjcgMzQzLjYyIDU1NS41MyAzNTIuOTAgQyA1NjIuNTYgMzU2Ljc2IDU3MC4xNiAzNTkuMjUgNTc3Ljg3IDM2MS4zNSBDIDU4Mi43MyAzNjIuNzYgNTgzLjkzIDM2OS4xNyA1ODAuOTQgMzcyLjkwIEMgNTc4LjYwIDM3Ny43NCA1NzIuNTIgMzc2LjcyIDU2OC4xNiAzNzUuODIgQyA1NTkuMDQgMzczLjUwIDU1MC43MCAzNjguODYgNTQyLjc3IDM2My45MyBDIDUzNC4wNCAzNjguNzEgNTI1LjQwIDM3NC4zNSA1MTUuNTIgMzc2LjM3IEMgNTExLjI3IDM3OC4yMiA1MDUuNDkgMzc2LjI5IDUwNC4zNSAzNzEuNjAgQyA1MDMuOTMgMzY5LjAzIDUwMy4xNCAzNjMuOTkgNTA2LjQ1IDM2Mi42NiBDIDUxNC40NSAzNTkuODAgNTIyLjQ5IDM1Ny4wMSA1MzAuMjkgMzUzLjYyIEMgNTI1LjcyIDM0Ni4zNCA1MTkuNjcgMzM5LjgzIDUxNy4wNiAzMzEuNDggQyA1MTguNDkgMzI5Ljg0IDUyMS4zNiAzMjYuNTUgNTIyLjc5IDMyNC45MCBDIDUzMS41MiAzMjcuODEgNTM2LjExIDMzNi4xMyA1NDEuNTggMzQyLjg4IEMgNTQ2LjY0IDMzNy4xOCA1NTAuMTAgMzMwLjMyIDU1Mi41NiAzMjMuMTUgQyA1MzcuMTUgMzIyLjczIDUyMS42OSAzMjMuNzEgNTA2LjMyIDMyMi41NyBDIDUwMC43MSAzMTkuOTYgNTAwLjg4IDMxMS4wNyA1MDYuNDMgMzA4LjU2IEMgNTE1LjEwIDMwNy4xNSA1MjMuOTAgMzA3LjAwIDUzMi42NyAzMDYuNTMgQyA1MzEuNTIgMzAyLjgwIDUzMC4zMCAyOTkuMDEgNTMwLjE2IDI5NS4wOCBaIiAvPgo8cGF0aCBmaWxsPSIjMTE3ZmU5IiBvcGFjaXR5PSIxLjAwIiBkPSIgTSAxODEuNDUgMzIxLjQ4IEMgMTkyLjU1IDMyMC40NSAyMDUuMTcgMzE5LjU0IDIxNC44NSAzMjYuMTUgQyAyMjYuODYgMzQ0LjUzIDIzMi4xMCAzNjYuMzcgMjM5LjA3IDM4Ni45OCBDIDI0MC41OSAzOTQuMzYgMjQ2Ljg4IDQwNC42NyAyMzcuNjUgNDA5LjYxIEMgMjMyLjYyIDQxMS4zNSAyMjQuMzkgNDEzLjQ0IDIyMS40NyA0MDcuNjEgQyAyMTguNDYgNDAyLjgwIDIxOC43OSAzOTYuMjIgMjE1LjI0IDM5MS45MSBDIDIwNi40MSAzOTAuODMgMTk3LjE2IDM5MS42MCAxODguMjUgMzkyLjM1IEMgMTgzLjMxIDM5Ny4xOCAxODUuMzQgNDA2LjI0IDE3OS43MCA0MTAuNzAgQyAxNzQuNzIgNDEzLjYwIDE2OC4zOSA0MTAuOTQgMTY0LjM4IDQwNy42NCBDIDE2MC45NSA0MDMuMzcgMTYxLjk4IDM5Ny4xNCAxNjMuNTQgMzkyLjMzIEMgMTY4LjY5IDM3NC42MCAxNzQuNzEgMzU3LjA3IDE4My4yOSAzNDAuNjcgQyAxODAuOTYgMzM5LjQxIDE3OC4yNSAzMzguNTkgMTc2LjQ0IDMzNi41NiBDIDE3My45MiAzMzEuMzggMTc1LjgxIDMyMy43MiAxODEuNDUgMzIxLjQ4IE0gMTkyLjAxIDM3Mi42OCBDIDE5Ny45OSAzNzIuNzYgMjAzLjk3IDM3Mi43MiAyMDkuOTUgMzcyLjYzIEMgMjA4LjM5IDM2My4yMiAyMDUuNDcgMzU0LjEyIDIwMS42OSAzNDUuMzggQyAxOTYuODggMzUzLjgyIDE5NC41MiAzNjMuMzcgMTkyLjAxIDM3Mi42OCBaIiAvPgo8L2c+CjxnIGlkPSIjZmZmZmZmZmYiPgo8cGF0aCBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIxLjAwIiBkPSIgTSAzMDUuMjAgMTc5LjQyIEMgMzExLjY4IDE4Mi44NiAzMTcuNTcgMTg3LjI2IDMyMy41NiAxOTEuNDggQyAzMzQuNDcgMTk5LjkwIDM0NS45NyAyMDcuNTcgMzU2LjM0IDIxNi42OCBDIDM0MC4yMCAyMzAuMDEgMzIzLjczIDI0Mi45OSAzMDYuNzQgMjU1LjIzIEMgMzA2LjI4IDI0Ny45MiAzMDYuMDUgMjQwLjYxIDMwNS45NiAyMzMuMzAgQyAyOTUuNDAgMjMwLjc3IDI4NC42NSAyMzQuNjQgMjc0LjU4IDIzNy40NSBDIDI2Mi4xNSAyNDAuODggMjUxLjk1IDI0OS4yMiAyNDAuNzYgMjU1LjIwIEMgMjMwLjA2IDI1My45MCAyMTkuNTAgMjUxLjQ4IDIwOC44NCAyNDkuODQgQyAyMjIuMTUgMjMxLjg4IDI0Mi4yNiAyMjAuNzIgMjYyLjYxIDIxMi41NCBDIDI3Ni4wNiAyMDYuNTAgMjkxLjA2IDIwNi41OCAzMDUuMDIgMjAyLjM3IEMgMzA1LjAxIDE5NC43MiAzMDUuMDYgMTg3LjA3IDMwNS4yMCAxNzkuNDIgWiIgLz4KPHBhdGggZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gNDM0LjE1IDIyNC4xNiBDIDQ0MC4wMyAyMTcuMDAgNDQ4LjM4IDIxMi42OCA0NTYuODEgMjA5LjI0IEMgNDU3LjEwIDIyNi4yMyA0NTcuMDIgMjQzLjIzIDQ1Ni45OCAyNjAuMjMgQyA0NDMuMDIgMjU5Ljg1IDQyOS4wMyAyNTguNjAgNDE1LjM0IDI1NS43OCBDIDQxOC42OCAyNDMuODIgNDI2LjIwIDIzMy40NiA0MzQuMTUgMjI0LjE2IFoiIC8+CjxwYXRoIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDQ2OS4xMyAyMDkuMTggQyA0ODkuOTMgMjE1LjM4IDUwMy42NCAyMzQuODQgNTExLjI1IDI1NC4yMCBDIDUwOC40OCAyNTYuNTcgNTA0LjU0IDI1Ni43MCA1MDEuMTggMjU3LjM2IEMgNDkwLjY0IDI1OC45NiA0NzkuOTkgMjU5LjgyIDQ2OS4zMyAyNTkuOTIgQyA0NjguODUgMjQzLjAxIDQ2OC44NiAyMjYuMDkgNDY5LjEzIDIwOS4xOCBaIiAvPgo8cGF0aCBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIxLjAwIiBkPSIgTSA0MTAuNzIgMjE4LjczIEMgNDE2LjY1IDIxNi4xMCA0MjIuNjIgMjEzLjExIDQyOS4xNCAyMTIuMzAgQyA0MTguMjEgMjI0LjQ0IDQwOC44MiAyMzguMDMgNDAyLjg4IDI1My4zMiBDIDM5My44NyAyNTAuNTggMzg0Ljg0IDI0Ny43NCAzNzYuMzEgMjQzLjc0IEMgMzg1LjQ1IDIzMi42MyAzOTguMTcgMjI1LjM1IDQxMC43MiAyMTguNzMgWiIgLz4KPHBhdGggZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gNDk3LjY0IDIxMi42MSBDIDUxNy43OCAyMTcuNTMgNTM2LjQ2IDIyOC42NCA1NTAuNDkgMjQzLjg5IEMgNTQxLjY0IDI0Ny4zMSA1MzIuMzUgMjQ5LjM4IDUyMy4wNiAyNTEuMTcgQyA1MTYuNTIgMjM3LjA5IDUwNy4xNiAyMjQuNzYgNDk3LjY0IDIxMi42MSBaIiAvPgo8cGF0aCBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIxLjAwIiBkPSIgTSAzNjYuMzkgMjUzLjY2IEMgMzc3LjE2IDI1Ni42NiAzODcuNDIgMjYxLjI3IDM5OC4yNyAyNjQuMDUgQyAzOTIuNjUgMjgzLjk3IDM5MC4wMSAzMDQuNTIgMzg4Ljg0IDMyNS4xNCBDIDM3Mi40OCAzMjQuOTcgMzU2LjExIDMyNi4wOSAzMzkuNzcgMzI1LjEyIEMgMzQwLjMzIDI5OS4wNiAzNTEuMDUgMjc0LjM4IDM2Ni4zOSAyNTMuNjYgWiIgLz4KPHBhdGggZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gNTM5LjQ1IDI2MC41NCBDIDU3MS4yOCAyNTYuNjQgNjA0LjA2IDI3Ni41MCA2MTUuNjggMzA2LjMxIEMgNjIxLjE3IDMyMS40MSA2MjMuMTggMzM4LjUxIDYxNy44OCAzNTMuOTUgQyA2MDkuODkgMzgxLjcyIDU4NC4wMyA0MDMuOTIgNTU0Ljk3IDQwNi4wNSBDIDUyMi45MiA0MTAuNjIgNDg4LjEyIDM5Mi41NyA0NzYuMDcgMzYxLjk3IEMgNDYyLjM0IDMzMS42MCA0NzMuNzMgMjkyLjg5IDUwMS4xMSAyNzQuMTYgQyA1MTIuMDggMjY1LjY2IDUyNS43NiAyNjEuNjQgNTM5LjQ1IDI2MC41NCBNIDUzMC4xNiAyOTUuMDggQyA1MzAuMzAgMjk5LjAxIDUzMS41MiAzMDIuODAgNTMyLjY3IDMwNi41MyBDIDUyMy45MCAzMDcuMDAgNTE1LjEwIDMwNy4xNSA1MDYuNDMgMzA4LjU2IEMgNTAwLjg4IDMxMS4wNyA1MDAuNzEgMzE5Ljk2IDUwNi4zMiAzMjIuNTcgQyA1MjEuNjkgMzIzLjcxIDUzNy4xNSAzMjIuNzMgNTUyLjU2IDMyMy4xNSBDIDU1MC4xMCAzMzAuMzIgNTQ2LjY0IDMzNy4xOCA1NDEuNTggMzQyLjg4IEMgNTM2LjExIDMzNi4xMyA1MzEuNTIgMzI3LjgxIDUyMi43OSAzMjQuOTAgQyA1MjEuMzYgMzI2LjU1IDUxOC40OSAzMjkuODQgNTE3LjA2IDMzMS40OCBDIDUxOS42NyAzMzkuODMgNTI1LjcyIDM0Ni4zNCA1MzAuMjkgMzUzLjYyIEMgNTIyLjQ5IDM1Ny4wMSA1MTQuNDUgMzU5LjgwIDUwNi40NSAzNjIuNjYgQyA1MDMuMTQgMzYzLjk5IDUwMy45MyAzNjkuMDMgNTA0LjM1IDM3MS42MCBDIDUwNS40OSAzNzYuMjkgNTExLjI3IDM3OC4yMiA1MTUuNTIgMzc2LjM3IEMgNTI1LjQwIDM3NC4zNSA1MzQuMDQgMzY4LjcxIDU0Mi43NyAzNjMuOTMgQyA1NTAuNzAgMzY4Ljg2IDU1OS4wNCAzNzMuNTAgNTY4LjE2IDM3NS44MiBDIDU3Mi41MiAzNzYuNzIgNTc4LjYwIDM3Ny43NCA1ODAuOTQgMzcyLjkwIEMgNTgzLjkzIDM2OS4xNyA1ODIuNzMgMzYyLjc2IDU3Ny44NyAzNjEuMzUgQyA1NzAuMTYgMzU5LjI1IDU2Mi41NiAzNTYuNzYgNTU1LjUzIDM1Mi45MCBDIDU2MS42NyAzNDMuNjIgNTY3LjIxIDMzMy44NCA1NjkuODUgMzIyLjkyIEMgNTczLjg2IDMyMS4zOCA1ODAuMTUgMzIzLjA1IDU4Mi42NSAzMTguNjUgQyA1ODUuMTIgMzE0LjczIDU4Mi42NSAzMDkuMDYgNTc4LjM0IDMwNy43OSBDIDU2OS42NSAzMDYuNDIgNTYwLjYwIDMwNy43NSA1NTIuMDMgMzA1Ljk1IEMgNTQ3LjMzIDMwMS43NyA1NDcuMjQgMjkzLjc0IDU0MS4wNSAyOTAuOTMgQyA1MzcuMzcgMjg4LjQyIDUzMC42NSAyOTAuMjQgNTMwLjE2IDI5NS4wOCBaIiAvPgo8cGF0aCBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIxLjAwIiBkPSIgTSAxMDkuMjcgMzExLjI2IEMgMTMyLjkzIDI3OC40NCAxNzUuMjAgMjYxLjk4IDIxNC45NiAyNjYuMDYgQyAyNTIuODcgMjY4LjYyIDI4OS41OCAyOTAuNTggMzA3LjY0IDMyNC4zNiBDIDMyMi41NiAzNTMuNDcgMzIxLjc0IDM5MC43NyAzMDIuOTUgNDE3Ljk3IEMgMjc1Ljc4IDQ1OC40NyAyMjEuODAgNDc2LjQ0IDE3NS4xNiA0NjQuMTMgQyAxNjYuNDMgNDcyLjAxIDE1Ny40OCA0ODAuMjAgMTQ2LjI0IDQ4NC4zMSBDIDEzOC41MiA0ODcuNTggMTMwLjI3IDQ4OS4yOCAxMjEuOTQgNDg5LjgyIEMgMTI1LjIxIDQ3OS42MiAxMzAuNDUgNDY5Ljg3IDEzMC45NyA0NTguOTcgQyAxMzAuODUgNDUzLjEzIDEzNC4xOSA0NDUuMDAgMTI3Ljg5IDQ0MS4xMyBDIDExNS4yOSA0MzAuNzkgMTA0LjcwIDQxNy44NyA5OC4xMSA0MDIuOTAgQyA4NS42NiAzNzMuMjggODguMzkgMzM2LjQ0IDEwOS4yNyAzMTEuMjYgTSAxODEuNDUgMzIxLjQ4IEMgMTc1LjgxIDMyMy43MiAxNzMuOTIgMzMxLjM4IDE3Ni40NCAzMzYuNTYgQyAxNzguMjUgMzM4LjU5IDE4MC45NiAzMzkuNDEgMTgzLjI5IDM0MC42NyBDIDE3NC43MSAzNTcuMDcgMTY4LjY5IDM3NC42MCAxNjMuNTQgMzkyLjMzIEMgMTYxLjk4IDM5Ny4xNCAxNjAuOTUgNDAzLjM3IDE2NC4zOCA0MDcuNjQgQyAxNjguMzkgNDEwLjk0IDE3NC43MiA0MTMuNjAgMTc5LjcwIDQxMC43MCBDIDE4NS4zNCA0MDYuMjQgMTgzLjMxIDM5Ny4xOCAxODguMjUgMzkyLjM1IEMgMTk3LjE2IDM5MS42MCAyMDYuNDEgMzkwLjgzIDIxNS4yNCAzOTEuOTEgQyAyMTguNzkgMzk2LjIyIDIxOC40NiA0MDIuODAgMjIxLjQ3IDQwNy42MSBDIDIyNC4zOSA0MTMuNDQgMjMyLjYyIDQxMS4zNSAyMzcuNjUgNDA5LjYxIEMgMjQ2Ljg4IDQwNC42NyAyNDAuNTkgMzk0LjM2IDIzOS4wNyAzODYuOTggQyAyMzIuMTAgMzY2LjM3IDIyNi44NiAzNDQuNTMgMjE0Ljg1IDMyNi4xNSBDIDIwNS4xNyAzMTkuNTQgMTkyLjU1IDMyMC40NSAxODEuNDUgMzIxLjQ4IFoiIC8+CjxwYXRoIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDQwOS44MyAyNjYuODUgQyA0MjUuMzEgMjY5LjcxIDQ0MC45NCAyNzEuNjEgNDU2LjY3IDI3Mi4zNiBDIDQ1Ny4zMCAyODkuNzggNDU2LjUwIDMwNy4yNSA0NTcuNzUgMzI0LjY2IEMgNDM5LjI1IDMyNS4yMiA0MjAuNzMgMzI0LjcwIDQwMi4yNCAzMjUuNjUgQyA0MDEuNTEgMzI1LjAzIDQwMC43OSAzMjQuNDEgNDAwLjA4IDMyMy43OSBDIDQwMS41MiAzMDQuNTQgNDA0LjA4IDI4NS4zNSA0MDkuODMgMjY2Ljg1IFoiIC8+CjxwYXRoIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDQ2OS4wOCAyNzIuNDEgQyA0NzQuNTggMjcyLjAxIDQ4MC4wOSAyNzEuNjEgNDg1LjYwIDI3MS4zMiBDIDQ4MC42OSAyNzcuOTQgNDc1LjcxIDI4NC41MyA0NzAuMjMgMjkwLjcwIEMgNDY5LjU4IDI4NC42MiA0NjkuMzAgMjc4LjUxIDQ2OS4wOCAyNzIuNDEgWiIgLz4KPHBhdGggZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gMzM5LjgxIDMzNy43MSBDIDM1Ni4xMSAzMzcuMjYgMzcyLjQyIDMzOC4xMSAzODguNzMgMzM3LjY0IEMgMzg5LjQ2IDM1OC4xNCAzOTIuNDAgMzc4LjY4IDM5OC44NiAzOTguMTkgQyAzODguMTcgNDAxLjUyIDM3Ny42MCA0MDUuMTcgMzY3LjE2IDQwOS4yMSBDIDM1MC41MCAzODkuMTYgMzQxLjI0IDM2My42NSAzMzkuODEgMzM3LjcxIFoiIC8+CjxwYXRoIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDQwMi4yMSAzMzcuMTggQyA0MjAuMDEgMzM4LjE2IDQzNy44MyAzMzUuOTUgNDU1LjYyIDMzNy4yNyBDIDQ1NS44OSAzMzcuNTUgNDU2LjQzIDMzOC4xMCA0NTYuNzAgMzM4LjM3IEMgNDU3LjYwIDM1NS40OSA0NTYuODMgMzcyLjY1IDQ1Ni45NiAzODkuODAgQyA0NDEuNDMgMzkwLjUyIDQyNS45NSAzOTIuMzQgNDEwLjg2IDM5Ni4xNiBDIDQwNC41MCAzNzcuODAgNDAxLjYyIDM1OC41NCA0MDAuMjMgMzM5LjIzIEMgNDAwLjg5IDMzOC41NCA0MDEuNTUgMzM3Ljg2IDQwMi4yMSAzMzcuMTggWiIgLz4KPHBhdGggZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gMTkyLjAxIDM3Mi42OCBDIDE5NC41MiAzNjMuMzcgMTk2Ljg4IDM1My44MiAyMDEuNjkgMzQ1LjM4IEMgMjA1LjQ3IDM1NC4xMiAyMDguMzkgMzYzLjIyIDIwOS45NSAzNzIuNjMgQyAyMDMuOTcgMzcyLjcyIDE5Ny45OSAzNzIuNzYgMTkyLjAxIDM3Mi42OCBaIiAvPgo8cGF0aCBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIxLjAwIiBkPSIgTSA0NjkuODEgMzc1LjQwIEMgNDczLjUzIDM4MC4xNyA0NzcuMDIgMzg1LjEzIDQ4MC4yNCAzOTAuMjYgQyA0NzYuNTUgMzkwLjIyIDQ3Mi44NSAzODkuOTcgNDY5LjE3IDM4OS43NSBDIDQ2OS4zMSAzODQuOTUgNDY5LjM1IDM4MC4xNyA0NjkuODEgMzc1LjQwIFoiIC8+CjxwYXRoIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDQxNC44MCA0MDcuNTkgQyA0MjguNDMgNDAzLjg4IDQ0Mi41OSA0MDIuNjIgNDU2LjY2IDQwMi4wOSBDIDQ1Ny4xMyA0MTkuMTcgNDU2Ljg4IDQzNi4yNiA0NTcuNDcgNDUzLjM0IEMgNDQ5LjE3IDQ1MS44MSA0NDIuMDQgNDQ2LjY4IDQzNi4xOSA0NDAuODEgQyA0MjYuMzkgNDMxLjcyIDQyMC42OCA0MTkuMzUgNDE0LjgwIDQwNy41OSBaIiAvPgo8cGF0aCBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIxLjAwIiBkPSIgTSA0NjkuNjcgNDAxLjc5IEMgNDgyLjk3IDQwMi44MyA0OTguNDYgNDAxLjQ0IDUwOS4wMyA0MTEuMTggQyA1MDcuMDkgNDE5LjMwIDUwMS41MiA0MjYuMTMgNDk3LjAxIDQzMy4wMCBDIDQ4OS44MSA0NDEuNzMgNDgxLjEzIDQ1MS4xMCA0NjkuNDggNDUzLjI1IEMgNDY4Ljg5IDQzNi4xMiA0NjguMzcgNDE4LjkwIDQ2OS42NyA0MDEuNzkgWiIgLz4KPHBhdGggZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gMzc2LjI1IDQxOC43MyBDIDM4NC43NSA0MTQuMTYgMzk0LjIxIDQxMS43NSA0MDMuNjEgNDA5Ljc4IEMgNDA2LjQ5IDQxNi4yOSA0MDkuMDAgNDIzLjA1IDQxMy4wMiA0MjguOTkgQyA0MTcuNDggNDM2LjUzIDQyNC4xMSA0NDIuNTEgNDI4LjUzIDQ1MC4wNyBDIDQwOC41OSA0NDQuODcgMzkwLjQ4IDQzMy41MyAzNzYuMjUgNDE4LjczIFoiIC8+CjxwYXRoIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDUyMC43OSA0MTUuMjMgQyA1MzAuMjYgNDE2Ljk3IDUzOS44NCA0MTguMTIgNTQ5LjM5IDQxOS4yOSBDIDU0Mi4xMyA0MjcuMzQgNTMyLjk3IDQzMy4yNiA1MjMuNzIgNDM4Ljc0IEMgNTE1Ljg0IDQ0My4zMSA1MDcuNDYgNDQ3LjI2IDQ5OC41MiA0NDkuMTkgQyA1MDYuMzQgNDM4LjE0IDUxNS4yMiA0MjcuNzAgNTIwLjc5IDQxNS4yMyBaIiAvPgo8cGF0aCBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIxLjAwIiBkPSIgTSAzNDUuMDIgNDc3Ljk2IEMgMzY3LjM5IDQ3Ni4zOCAzODkuMTQgNDY4LjYxIDQwNy44NCA0NTYuMjUgQyA0MTcuNjkgNDYwLjg2IDQyOC41MSA0NjIuNTggNDM4LjcxIDQ2Ni4xOSBDIDQyNS4zOCA0ODEuMjIgNDA2Ljg2IDQ5MC42MyAzODguMTMgNDk3LjIxIEMgMzY1LjIxIDUwNS4wOSAzNDAuNDggNTA2LjgzIDMxNi41MyA1MDMuNTcgQyAyOTIuNTYgNDk5LjU1IDI2OC4wMCA0OTEuODQgMjQ5LjU5IDQ3NS4zMSBDIDI1OS4xNyA0NzAuNzkgMjY4LjgxIDQ2Ni4zNCAyNzcuOTcgNDYwLjk5IEMgMjk4LjIzIDQ3Mi41NSAzMjEuNTEgNDc5LjY0IDM0NS4wMiA0NzcuOTYgWiIgLz4KPC9nPgo8L3N2Zz4=
// @match        *://*/*
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
// @grant        GM_notification
// @updateURL    https://raw.githubusercontent.com/Qing90bing/Qing_Web-Translate-Script/main/dist/Web-Translate-Script.cdn.user.js
// @downloadURL  https://raw.githubusercontent.com/Qing90bing/Qing_Web-Translate-Script/main/dist/Web-Translate-Script.cdn.user.js
// @supportURL   https://github.com/Qing90bing/Qing_Web-Translate-Script/issues
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
        [/↩\s*Add a new line\s*\n\s*Alt\s*\+\s*↩\s*Append text without running\s*\n\s*Ctrl\s*\+\s*↩\s*Run prompt/i, '↩  换行\nAlt + ↩  追加文本 (不执行)\nCtrl + ↩  执行指令'],
        [/Invalid JSON: SyntaxError: Unexpected token '(.+?)', "(.+?)" is not valid JSON/i, '无效的 JSON 语法错误：在 “$2” 中存在意外的字符 “$1”'],
        [/([<>]=?)\s*(\d+K)\s+tokens\s+•\s+Input:\s+\$([\d.]+)\s+\/\s+Output:\s+\$([\d.]+)/i, '$1$2 Tokens | 输入: $$ $3 / 输出: $$ $4'],
        [/Image \(\*Output per image\) • Input: \$([\d.]+) \/ Output: \$([\d.]+)/i, '图像 (*每张图片输出) | 输入: $$ $1 / 输出: $$ $2'],
        [/All context lengths\s+•\s+Input:\s+\$([\d.]+)\s+\/\s+Output:\s+\$([\d.]+)/i, '所有上下文长度 | 输入: $$ $1 / 输出: $$ $2'],
        [/↩\s*Add a new line\s*\n\s*Ctrl\s*\+\s*↩\s*Run prompt/i, '↩  换行\nCtrl + ↩  执行指令'],
        [/Last modified:\s*(\d{4})\/(\d{1,2})\/(\d{1,2})/, '最后修改于：$1 年 $2 月 $3 日'],
        [/Text • Input: \$([\d.]+) \/ Output: \$([\d.]+)/i, '文本 | 输入：$$ $1，输出：$ $2'],
        [/Knowledge cut off:\s+(\d{1,2})月\s+(\d{4})/i, '知识截止日期: $2 年 $1 月'],
        [/^Copied\s+models\/(.+)\s+to\s+clipboard$/i, '已将模型“$1”复制到剪贴板'],
        [/^Copied\s+(.+)\s+to\s+clipboard$/i, '已将模型“$1”复制到剪贴板'],
        ['Google Account: (.+?) \\((.+?)\\)', 'Google 帐号：(.+?) \\((.+?)\\)'],
        [/Analyzed errors for (\d+) seconds/, '分析了 $1 秒的错误'],
        [/Dec\s+(\d{1,2}),\s+(\d{4})/, '$2 年 12 月 $1 日'],
        [/Nov\s+(\d{1,2}),\s+(\d{4})/, '$2 年 11 月 $1 日'],
        [/Oct\s+(\d{1,2}),\s+(\d{4})/, '$2 年 10 月 $1 日'],
        [/Apr\s+(\d{1,2}),\s+(\d{4})/, '$2 年 4 月 $1 日'],
        [/Aug\s+(\d{1,2}),\s+(\d{4})/, '$2 年 8 月 $1 日'],
        [/Feb\s+(\d{1,2}),\s+(\d{4})/, '$2 年 2 月 $1 日'],
        [/Jan\s+(\d{1,2}),\s+(\d{4})/, '$2 年 1 月 $1 日'],
        [/Jul\s+(\d{1,2}),\s+(\d{4})/, '$2 年 7 月 $1 日'],
        [/Jun\s+(\d{1,2}),\s+(\d{4})/, '$2 年 6 月 $1 日'],
        [/Mar\s+(\d{1,2}),\s+(\d{4})/, '$2 年 3 月 $1 日'],
        [/May\s+(\d{1,2}),\s+(\d{4})/, '$2 年 5 月 $1 日'],
        [/Sep\s+(\d{1,2}),\s+(\d{4})/, '$2 年 9 月 $1 日'],
        [/(\d+) tokens \/ image/, '$1 Tokens / 图像'],
        [/\/\s+(\d+)\s+generations?/i, '/ $1 次生成'],
        [/Thought for (\d+) seconds/, '思考了 $1 秒'],
        [/Move\s+([\w\.-]+)\s+to/i, '将 $1 移动到'],
        [/^\s*(-?\d+(\.\d+)?)\s*s\s*$/i, '$1 秒'],
        ['(\\d+) / (\\d{1,3}(,\\d{3})*)', '$1 / $2'],
        [/(\d+)\s*minutes?\s*ago/, '$1 分钟前'],
        [/(\d+)h\s+(\d+)m/i, '$1 小时 $2 分钟'],
        [/(\d+)\s*months?\s*ago/, '$1 个月前'],
        [/^Branch of\s+(.+)$/i, '分支于：“$1”'],
        [/(\d+)\s*hours?\s*ago/, '$1 小时前'],
        [/(\d+)\s*seconds?\s*ago/, '$1 秒前'],
        [/(\d+)\s*weeks?\s*ago/, '$1 周前'],
        [/(\d+)\s*years?\s*ago/, '$1 年前'],
        [/^Selected\s+(.+)$/i, '已选择 $1'],
        [/(\d+)\s*days?\s*ago/, '$1 天前'],
        [/^Deleted\s+(.+)$/i, '已删除$1'],
        [/Edit\s+([\w\.-]+)/i, '编辑 $1'],
        [/Share\s+"(.+?)"/i, '分享“$1”'],
        [/^(\d+)\s+months?$/i, '$1 月'],
        [/^Delete\s+(.+)$/i, '删除 $1'],
        [/^(\d+)\s+weeks?$/i, '$1 周'],
        [/^(\d+)\s+years?$/i, '$1 年'],
        [/^(\d+)\s+days?$/i, '$1 天'],
        [/(\d+)h/i, '$1 小时'],
        [/(\d+)m/i, '$1 分钟'],
        [/(\d+)d/i, '$1 天'],
      ],
      textRules: [
        [" from AI Studio, which will give your app a public URL. It's deployed along with a proxy server that will keep your API key private, however the deployed app will use your API key for all users' Gemini API calls. You can also download your app as a zip file. If you replace the placeholder value with a real API key, it should still work. But you ", '您可以通过 AI Studio 为您的应用生成一个公开网址，部署时会附带一个代理服务器来保护您的 API 密钥隐私。不过，所有用户通过该应用发出的 Gemini API 调用，都将使用您的 API 密钥。您也可以将应用下载为 ZIP 压缩文件。即便您将占位符替换为真实的 API 密钥，应用仍可正常运行，但是您'],
        ['. By default your app is private. You can share your app with other users to let them use it. Users you share your app with can see its code and fork it for their own purposes. If you share your app with edit permission, the other users can edit the code of your app. ', '您的应用默认是私密的。您可以分享给其他用户使用。收到分享的用户可以看到您应用的代码，并根据自己的需求进行“复刻”(fork)。如果您授予编辑权限，他们便可以修改您应用的代码。'],
        ['The configuration is for working with Angular + TypeScript application. The Code Assistant is instructed to work with Angular components, services, and modules. It follows strict guidelines for using the Gemini API', '此配置专用于 Angular + TypeScript 应用的开发工作。启用后，代码助手将专注于此框架，能深度理解其组件、服务和模块的协同工作方式，从而生成更专业、可靠且贴合项目规范的代码'],
        ['The configuration is for working with React + TypeScript application. Assumes a basic structure with index.html and index.tsx. Code Assistant follows strict guidelines for using the Gemini API', '该配置用于使用React + TypeScript应用程序进行了特别优化,假设具有index.html和index.tsx的基本结构,代码助理遵循严格使用Gemini API的准则，生成遵循 React 最佳实践的、高质量且可靠的代码'],
        ['Image output is priced at $30 per 1,000,000 tokens. Output images up to 1024x1024px consume 1290 tokens and are equivalent to $0.039 per image. Usage in AI Studio UI is free of charge', '图片生成服务按 30 $/每百万 token的价格计费。举例来说，一张不大于 1024x1024 像素的输出图片会消耗 1290 个 Token，相当于每张图片 0.039 美元。请注意，在 AI Studio 用户界面中的使用是完全免费的'],
        ["An environment for building with the Gemini SDK. Go from prompt to working project. Transition to code for deeper refinement and customization. Explore and fork demos showcasing the API's full potential.", '一个使用 Gemini SDK 进行开发的集成环境。从一个提示语开始，构建出一个可运行的项目。您还可以深入代码进行优化和定制。快来探索和复刻那些能充分展示 API 潜力的演示项目吧。'],
        ['Image generation with Imagen in AI Studio has limited free quota for testing. To generate images beyond this limit or integrate Imagen into your projects, please use the Gemini API', '在 AI Studio 中使用 Imagen 生成图片有免费的测试额度。如需生成更多图片或将 Imagen 集成到您的项目中，请使用 Gemini API。'],
        ['Image generation with Imagen in AI Studio has limited free quota for testing. To generate images beyond this limit or integrate Imagen into your projects, please use the Gemini API.', '在AI工作室中使用Imagen的图像生成的测试免费配额有限。要生成超过此限制的图像或将成像符集成到项目中，请使用Gemini API。'],
        ['Video generation with Veo in AI Studio has limited free quota for testing. To generate videos beyond the free limit or to integrate Veo into your projects, please use the Gemini API.', '在 AI Studio 中使用 Veo 生成视频有免费的测试额度。如需生成更多视频或将 Veo 集成到您的项目中，请使用 Gemini API。'],
        [' is set to a placeholder value that you can use. When another user uses your app, AI Studio proxies the calls to the Gemini API, replacing the placeholder value with ', '已设为一个您可以使用的占位符值。当其他用户使用您的应用时，AI Studio 会通过代理向 Gemini API 发出调用，并将占位符替换为'],
        ['Discover how to use the Gemini 2.5 image model (aka nano banana) using the Gemini JS SDK in an interactive way. No need to create an API key or set up your environment.', '以交互式方式探索如何使用 Gemini 2.5 图像模型（又名 nano banana）和 Gemini JS SDK。无需创建 API 密钥或设置您的环境。'],
        ['Deploy your app as a Cloud Run Service. The app will be accessible via a public URL. Your API key will not be exposed in the app, but will be used by the application', '将您的应用部署为 Cloud Run 服务后，即可通过一个公开网址访问。您的 API 密钥不会在应用中泄露，但会被后端服务使用。'],
        [' Your conversations won’t be saved. However, any files you upload will be saved to your Google Drive. Logging policy still apply even in Temporary chat. See ', '你的对话将不会被保存。然而，你上传的任何文件都将被保存到你的 Google 网盘。即使在临时聊天中，日志记录政策仍然适用。请参阅'],
        ['Deploy your app as a Cloud Run Service. The app will be accessible via a public URL. Your API key will not be exposed in the app, but will be used by the application.', '将您的应用部署为 Cloud Run 服务。该应用将通过公共 URL 访问。您的 API 密钥不会暴露在应用中，但会被应用使用'],
        ["AI Studio's GitHub integration allows you to create a repository for your work and commit your latest changes. We do not currently support pulling remote changes.", 'AI Studio 已集成 GitHub，您可以为自己的项目创建代码仓库并提交最新更改。我们目前暂不支持拉取远程仓库的更改。'],
        ['When you share an app with another user, they will be able to see all of its source code. Ensure that your code does not contain any sensitive information, such as API keys.', '当您与其他用户分享应用时，他们将能看到全部源代码。请确保您的代码不含任何敏感信息，例如 API 密钥。'],
        ['Apps run in your browser in a sandboxed iframe. There is no server-side component. To run an app that requires additional services such as a backend, consider using', '应用在您浏览器的沙盒化 iframe 中运行，不包含任何服务器端组件。要运行需要后端等额外服务的应用，请考虑使用'],
        ['Individual customer availability may vary depending on billing status and surface used: free tier, billed tier, as well as the chosen model and API features in use.', '您能使用的具体功能，取决于您的账户类型 (例如免费或付费套餐)、所选择的模型以及正在使用的特定 API 功能。'],
        ['Generate stunning watercolor paintings from any Google Maps address. Your childhood home, the cafe where you met your love, all beautifully captured. Try it now!', '从任意谷歌地图地址生成令人惊叹的水彩画。您童年的家、与爱人相遇的咖啡馆，一切都将被精美捕捉。立即体验！'],
        ['Upload your photo and travel through time! This app uses AI to generate polaroid-style images of you reimagined in the iconic styles of different decades.', '上传您的照片，穿越时空！此应用利用 AI 生成宝丽来风格的图像，以不同年代的标志性风格重塑您的形象。'],
        ['To ensure that viewers are aware of an app’s usage of their webcam or other devices, we require an extra acknowledgement before the app can access these ', '为确保用户清楚应用会使用其网络摄像头或其他设备，我们要求应用在访问前必须获得用户的额外授权。'],
        ['Create and simulate generative media with the latest Veo 3 Fast and GenMedia models using tldraw canvas to explore different workfflows', '使用最新的 Veo 3 Fast 和 GenMedia 模型，通过 tldraw 画布创建和模拟生成式媒体，探索不同的工作流程'],
        ['A powerful, AI photo editor. Retouch, apply creative filters, and make professional adjustments to your images using simple text prompts.', '一款强大的 AI 照片编辑器,使用简单的文本提示词对您的图像进行修饰、应用创意滤镜并进行专业调整。'],
        ['MCP & Gemini power your global guide! AI answers geo-queries on interactive maps. Explore, discover, and see the world anew.', 'MCP 与 Gemini 联 手打造您的全球向导！AI 可在交互式地图上回答地理位置查询。尽情探索、发现，用全新视角看世界。'],
        ['Transform images into interactive p5.js code sketches with AI! Generate multiple clever, playful variations and bring your photos to life.', '借 助 AI 将图片转变为可交互的 p5.js 代码草图！生成多种巧妙有趣的版本，让您的照片焕发生机。'],
        ['This model has limited free quota for testing. To generate images beyond the limit or use the model in your projects, use the Gemini API.', '该模型的免费测试配额有限,要生成超出限制的图像或在项目中使用该模型，请使用 Gemini API'],
        [' deploy your app like this, as any user will be able to see the API key. To make an app run securely outside of AI Studio requires ', '以这种方式部署应用，因为任何用户都能看到 API 密钥。要让应用在 AI Studio 之外安全运行，需要'],
        ['Discover how to take your first steps with the Gemini JS SDK in an interactive way. No need to create an API key or set up your environment.', ' 通过交互式教程，轻松入门 Gemini JS SDK。无需创建 API 密钥，也无需配置开发环境。'],
        [' (not your) API key. Do not use a real API key in your app, as the code is visible to anyone who can view your app. ', '（而非您自己的）API 密钥 。请勿在应用中使用真实的 API 密钥，因为代码对所有能查看您应用的人都是可见的。'],
        ['Adjust how likely you are to see responses that could be harmful. Content is blocked based on the probability that it is harmful.', '调整安全设置：过滤可能有害的内容。系统会根据内容属于有害信息的可能性进行屏蔽。'],
        ['Explore places in the world using Gemini and the Google Maps API. Ask Gemini to find you interesting places and more.', '使用 Gemini 和 Google 地图 API 探索世界。您可以让 Gemini 寻找有趣的地点，或发掘更多玩法。'],
        ['Upload a photo of yourself and an outfit to see how it looks on you. A virtual fitting room powered by Nano Banana.', '上传您的个人照片和心仪服装，即可轻松预览上身效果。这间虚拟试衣间由 Nano Banana™ 倾力打造。'],
        ["Unlock Gemini's vision! Detect objects in images or screenshares with interactive 2D/3D bounding boxes and points.", '解锁 Gemini 的视觉能力！通 过可交互的 2D/3D 边界框和关键点，检测图片或屏幕共享中的物体。'],
        ['Enable function calling to get automatically generated responses for your function calls.', '启用函数调用功能，让 Gemini 不再“纸上谈兵”。开启后，它能连接外部工具获取实时数据 (如股价、天气)，使答案更及时、可靠'],
        ['Failed to generate video, quota exceeded: due to high demand, Veo is currently at capacity. Please try again in a few moments. ', '视频生成失败，额度已用尽：由于需求过高，Veo 服务器当前负载已满，请稍后重试。'],
        ['Instantly turn YouTube videos into fun learning apps using AI. Explore concepts visually and learn actively!', '借助 AI，即刻将 YouTube 视频转变 为有趣的学习应用。通过可视化方式探索概念，实现主动式学习！'],
        ['Google AI Studio uses cookies from Google to deliver and enhance the quality of its services and to analyze traffic.', 'Google AI Studio 使用 Google 的 Cookie 来提供并优化服务品质，以及分析网站流量。'],
        ['In order to use GitHub for this app, we need you to create your own copy first. Click “Save” below to get started.', '为了将 GitHub 用于此应用程序，我们需要您先创建自己的副本。单击下面的 “保存” 开始。'],
        ['Your AI creative coding partner for p5.js. Chat to generate interactive art and games, then edit and preview live.', '您的 p5.js AI 创意编程伙伴 。通过聊天生成交互式艺术和游戏，并进行实时编辑和预览。'],
        ['This feature enables the model to choose to not respond to audio that’s not relevant to the ongoing conversation', '让 Gemini 拥有“抗干扰”能力，能自动忽略背景噪音或无关的旁人对话，使交流更加专注'],
        [' “Create an image of a fancy house by a pond in the forest in front of grassland with wildflowers, close ...” ', ' “创建一张图片，内容为森林池塘边的一栋漂亮房子，前面是长满野花的草地，近景...” '],
        ['Sketch and prompt, Gemini brings your drawings to life! Co-create amazing art collaboratively with AI.', '寥寥几笔，加上提示词，Gemini 就能让您的画作栩栩如生！与 AI 携手，共同创作惊艳的艺术作品。'],
        ['Explore a dynamic gallery, dive into examples and remix video prompts to generate your own unique variations', '探索动态作品集，深入了解示例，并 通过混合改编视频提示词，生成您专属的独特作品。'],
        ['Instantly create interactive flashcards for any topic with the power of Gemini! Learn smarter, not harder.', '借助 Gemini 的强大功能，即刻为任何 主题创建交互式抽认卡！学习要用巧劲，而非蛮力。'],
        ['Sketch and prompt, Gemini brings your drawings to life! Co-create collaboratively with AI by sketching and prompting.', '素描加提示，Gemini 让您的画作栩栩如生！通过素描和提示与 AI 协同创作。'],
        ['An interactive video player that lets you summarize, describe scenes, extract text, search for objects, and more.', '一款交互式视频播放器，可以帮您总结内容、描述场景、提取文字、搜索物体等等。'],
        ['Usage information displayed is for the API and does not reflect AI Studio usage, which is offered free of charge.', '显示的使用信息适用于API，不反映AI Studio的使用情况，该信息是免费提供的。'],
        ["“Create a horizontally oriented rectangular stamp that features the Mission District's vibrant culture...”", '“创建一个以米慎区 (Mission District) 充满活力的文化为特色的横向矩形邮票...”'],
        ['“Create a video with an image: a cute creature with snow leopard-like fur is walking in a winter forest.”', '“用一张图片创建一个视频：一只长着雪 豹般皮毛的可爱生物正在冬天的森林里行走。”'],
        ['Tiny cats explain! Get fun, illustrated slideshows breaking down complex topics with adorable feline metaphors.', '让小猫咪为您讲解！用生动有趣的幻灯片和可爱的猫咪比喻，轻松理解复杂主题。'],
        [" This functionality is not yet available. We're excited to support more use-cases for apps in the future. Please consider ", '该功能尚不可用。我 们期待未来能支持更多的应用场景。请考虑'],
        ['Discover amazing places, plan your perfect day trips, and visualize your adventures on an interactive map.', '发现绝佳去处，规划完美的一日游，并 在交互式地图上直观地展现您的冒险路线。'],
        ['Experience real-time voice chat with 3D visuals react to your conversation, bringing AI interaction to life.', '体验实时语音聊天，3D 视觉效果会随您的对话动态变化，让 AI 互动栩栩如生。'],
        ['*: This is an estimated cost if you make the same request via API. Usage on AI Studio is free.', '*: 如果您通过 API 发出相同的请求，这是一个估计成本。在 AI Studio 上使用是免费的。'],
        ['An interactive tool that allows you to design, test, and banter with custom AI characters on the fly.', '一款交互式工具，让您可以即时设计、测试自定义 AI 角色，并与之轻松互动闲聊。'],
        ['Effortless dictation powered by Gemini. Turn long rambling recordings into perfectly transcribed notes.', '由 Gemini 驱动的轻松听写功能。将冗长杂乱的录音转为条理清晰的文字笔记。'],
        ['Higher resolutions may provide better understanding but use more tokens.', '更高的分辨率能让 Gemini 看清图像细节，提升分析质量，但这会消耗更多 Token，通常意味着费用更高、速度更慢'],
        ['Lets you define functions that Gemini can call This tool is not compatible with the current active tools.', '允许您定义可供 Gemini 调用的函数。此工具与当前已启用的工具不兼容。'],
        ['Set how much the model should think, 0 tokens being not at all and 24576 being as much as possible', '设置模型应该思考多少Tokens，0个Token表示不考虑，24576个Tokens表示考虑更多'],
        ['The entire contents of earlier versions of the files of your app if they changed in this session', '如果在本次会话中您的应用文件发生了更改，这里会包含文件早期版本的全部内容。'],
        ['Build Photoreal 3D maps with natural language using a Gemini-powered Agent and MCP tool.', '使用由 Gemini 驱动的 Agent 和 MCP 工具，通过自然语言构建照片级真实的 3D 地图。'],
        ["You don't have any Google Cloud projects with a paid quota tier. If you want to use the paid tier,", '您没有任何已启用付费方案的 Google Cloud 项目。如果您想使用付费方案，'],
        ['Explore an infinite wiki where every word is a hyperlink to descriptions generated in real-time.', '探索一个无限的知识库，其中每个词都是一个超链 接，指向实时生成的解释。'],
        ['Let the model decide how many thinking tokens to use or choose your own value', '设置模型用于“思考和推理”的计算量。值越高，越有助于解决复杂难题，但也会增加响应时间和费用'],
        ["No speakers detected. Please ensure your script's speaker names are also set in the right sidebar.", '未检测到发言人。请确保您已在右侧边栏中设置了脚本对应的发言人名称。'],
        ['Let Gemini adapt its response style to the input expression and tone', '让 Gemini 的回应更有“人情味”。它会尝试感知您的情绪和语气，并用相应的风格来回应，使交流更有共鸣'],
        ['Set how much the model should think, with 32768 being as much as possible', '设定模型的“思考”计算量 (上限 32768)。更高的值能提升复杂推理能力，但会增加费用和响应时间。'],
        [" “An evocative image of an English afternoon tea table with newspaper headline of 'Gemini 2.5' ...” ", '“一张引人入胜的英式下午茶桌图片，报纸头条为‘Gemini 2.5’...”'],
        ['Chat with Gemini to explore and understand the Gemini API documentation using the URL Context tool.', '与 Gemini 聊天，使用URL上下文工具探索和理解 Gemini API 文档。'],
        ['Enable a sliding context window to automatically shorten chat history by removing the oldest turns.', '启用滑动上下文窗口，通过移除最早的对话轮次来自动精简聊天记录'],
        ['apply to use of apps featured on the Showcase tab in AI Studio, unless otherwise noted.', '适用于 AI Studio “作品展示”(Showcase) 标签页中的精选应用，除非另有说明。'],
        ['Builds apps using the SDK without a key, try “an image generator that uses Imagen”', '无需 API 密钥即可使用 SDK 构建应用，例如试试“一个使用 Imagen 的图片生成器”。'],
        ['Start building with Gemini, try “Build me an AI photo editing app using Nano Banana”', '使用Gemini开始构建，尝试“使用Nano Banana为我构建一个AI照片编辑应用程序”'],
        ['A playground to discover the range of creative voices that the Gemini native audio out has to offer.', '一个可以体验 Gemini 原生音频各种创意声音 的“游乐场”。'],
        ['“Create a video showing some hands first sprinkling salt into a pan of stir-fried vegetables...“', '“创建一个视频，画面中一双手先将盐撒入一锅翻炒的蔬菜中……”'],
        ['Are you sure you want to delete your prompt and generated output? This action cannot be undone.', '您确定要删除您的提示词和已生成的内容吗？此操作无法撤销。'],
        ['At the moment these libraries are not supported, because of limited support for compiler plug-ins.', '由于对编译器插件的支持有限，目前暂不支持这 些库。'],
        ['Usage is only reflective of GenerateContent requests. Other request types are not yet supported.', '用量仅反映 “生成内容” 请求。其他请求类型暂不支持。'],
        ['Released Gemini 2.0 Flash, 2.0 Flash-Lite Preview, 2.0 Pro Experimental, and more', '发布了 Gemini 2.0 Flash、2.0 Flash-Lite 预览版、2.0 Pro 实验版等'],
        ['Use a single voice with advanced tone and emotion controls or simulate a two-voice dialogue', '使用具有高级音调和情感控制的单人语音，或模拟双人对话。'],
        [' may make mistakes, so double-check its response. Gemma is provided under and subject to the ', '可能会出错，因此请仔细检查其响应。Gemma根据使用条款'],
        ['You are responsible for ensuring that safety settings for your intended use case comply with the', '您有责任确保安全设置符合您预期用途的相关规定 。'],
        [" “The building's primary structure mimics a colossal, ancient banyan tree, with a ...” ", ' “该建筑的主要结构模仿一棵巨大而古老的榕树，其...” '],
        ['(aka Gemini 2.5 Flash Image) State-of-the-art image generation and editing model.', '（又名 Gemini 2.5 Flash Image）最先进的图像生成和编辑模型'],
        ['Probability threshold for top-p sampling', '筛选出一个“精英候选词”的范围。值越高，候选范围越大，回复更多样；值越低，范围越小，回复也更专注和可预测'],
        ['API pricing per 1M tokens. Usage in AI Studio UI is free of charge', 'API 定价以每百万 token 为单位计算,在 AI Studio 界面中的使用则完全免费'],
        ['Our hybrid reasoning model, with a 1M token context window and thinking budgets.', '我们的混合推理模型，拥有100万 Token 上下文窗口和思考预算'],
        ['Teach me a lesson on quadratic equations. Assume I know absolutely nothing about it', '给我讲一堂关于一元二次方程的课。假设我对此一无所知。'],
        ['Instantly transform your text prompts into charming animated doodles with Gemini.', '使用 Gemini，即刻将您的文本提示词变为有趣的动画涂鸦。'],
        ['Lets you define functions that Gemini can call', '允许您定义可供 Gemini 调用的函数,让 AI 能调用外部工具 (如 API) 来获取实时信息 (如天气)'],
        ['Generate structured output This tool is not compatible with the current active tools.', '生成结构化输出。此工具与当前已启用的工具不兼容。'],
        ['Lets Gemini send audio and video when speech is not detected', '允许 Gemini 在您停顿或未说话时也能主动回应，使音视频对话体验更流畅、自然。'],
        [" Try Gemini's natural, real-time dialog experience, with audio and video inputs ", '尝试 Gemini 的自然、实时对话体验，包括音频和视频输入'],
        [' Turn the panda into an adventurer archaeologist in a lush Mayan jungle. ', '让熊猫化身为一名冒险考古学家，置身于植被丰茂的玛雅丛林之中'],
        ['Our most powerful reasoning model, which excels at coding and complex reasoning tasks.', '我们最强大的推理模型，擅长编码和复杂推理任务'],
        ['Simulate a computer with a UI that is generated dynamically from user interactions.', '模拟一台计算机，其用户界面根据用户交互动态生成。'],
        ['Show me different logos and brand swag ideas for my startup called Avurna', '为我名为 Avurna 的初创公司展示不同的标志和品牌周边创意。'],
        [' “Photorealistic long exposure photograph of a subway platform, straight-on view.” ', ' “地铁站台的写实风格长曝光照片，正面视角。” '],
        ['Creativity allowed in the responses', '调整模型回复的创造力，值越高，回复越有想象力但可能不准确；值越低，回复越严谨专注但可能比较刻板'],
        ['Explore a retro OS that brings back nostalgic memories with an AI twist.', '探索一款复古操作系统，体验 AI 为其注入的全新怀旧风情。'],
        ['To allow the model to view URLs, turn on URL Context under Tools.', '如需允许模型查看网址内容，请在“工具”中开启“网址上下文”功能。'],
        ['Can I develop apps locally with my own tools and then share them here?', '我可以使用自己的工具在本地开发应用，然后在这里分享吗？'],
        ['Describe the style of your dialog, e.g. "Read this in a dramatic whisper"', '描述您对话的风格，例如：“用充满戏剧性的耳语来朗读”。'],
        ['Your prompt is being queued. Your generated video will appear here shortly', '您的提示词已加入队列。生成的视频稍后将在此处显示。'],
        ["Don't use a real API key in your app. Use a placeholder value instead.", '不要在您的应用中使用真实的 API 密钥，请改用占位符值。'],
        ['Our most balanced multimodal model with great performance across all tasks.', '我们最均衡的多模态模型，在所有任务中都表现出色'],
        ['Select or upload a file on Google Drive to include in your prompt', '从 Google 云端硬盘选择或上传文件，以包含在您的提示词中。'],
        ['Our smallest and most cost effective model, built for at scale usage.', '我们最小、最具成本效益的模型，专为大规模使用而构建'],
        ['Submitting this feedback report will send the following information to Google:', '提交此反馈报告将向 Google 发送以下信息：'],
        ["Try Gemini's natural, real-time dialog with audio and video inputs", '体验 Gemini 自然流畅的实时对话，支持音频和视频输入。'],
        [' Gemini 2.5 Flash Image, state of the art image generation and editing ', 'Gemini 2.5 Flash 图像，最先进的图像生成和编辑'],
        ['Get SDK code to interact with Gemini Live', '获取可直接使用的代码 (SDK)，让您自己的应用程序也能连接并使用 Gemini 的能力'],
        ['Open model built for running with high efficiency on low-resource devices.', '为在低资源设备上高效运行而构建的开放模型'],
        ['Lets Gemini use code to solve complex tasks', '允许 Gemini 运行代码，从而能准确地进行数学计算、数据分析或处理文件等任务'],
        ['Use the long context for analyzing large datasets, codebases or documents', '使用长上下文分析大型数据集、代码库或文档。'],
        ['Generate a scavenger hunt for street food around the city of Seoul, Korea', '为韩国首尔市的街头小吃设计一个寻宝游戏。'],
        ['The below reflects how to structure your script in your API request.', '以下示例展示了如何在 API 请求中构建您的脚本。'],
        [' Google AI models may make mistakes, so double-check outputs.', 'Google AI 模型可能会出错，因此请仔细检查其输出内容。'],
        ['. App creators can add these permission requests to their app’s ', '应用开发者可以将这些权限请求添加到他们的应用中。'],
        ['Add new features or easily modify this app with a prompt or the suggestions below', '添加新功能或轻松修改此应用程序'],
        ['Speaker names must be consistent with speakers used in your prompt', '发言人姓名必须与提示词中使用的发言人保持一致。'],
        ['Open model that can handle complex tasks with visual and text input.', '能够处理复杂的视觉和文本输入任务的开放模型'],
        ['Plot sin(x) from 0 to 2*pi. Generate the resulting graph image.', '绘制 sin(x) 从 0 到 2*pi 的函数图像，并生成图片。'],
        [' Branch out from one generation to the next with multimodal workflows ', '多模态工作流，从一种生成方式分支到下一种'],
        ['Changes to the safety settings below apply to text inputs and outputs.', '以下安全设置的更改适用于文本输入和输出。'],
        ['Generate structured output', '生成结构化输出,让 AI 按固定的格式 (如 JSON) 回答，使其输出能像数据一样被程序直接使用'],
        ['This model is not stable and may not be suitable for production use', '此模型尚不稳定，可能不适合在生产环境中使用。'],
        ['Generate a Docker script to create a simple linux machine.', '生成一个 Docker 脚本来创建一个简单的 Linux 虚拟机。'],
        ['Our best image generation model yet, engineered for creativity', '我们迄今为止最强大的图片生成模型，专为创意而生。'],
        ['Truncate response including and after string', '设定一个“刹车词”，当模型准备生成这个词（或短语）时，就会立刻停止输出'],
        ['Enter a list of function declarations for the model to call upon. See the', '输入一组函数声明供模型调用。请参阅'],
        ['Number of tokens kept in context after sliding the context window', '上下文窗口滑动后，保留的 Token (令牌)数量'],
        ['Select or Upload a file on Google Drive to send to the model', '从 Google 云端硬盘选择或上传文件以发送给模型。'],
        ['Upload a file to Google Drive to include in your prompt', '将文件上传到 Google 云端硬盘，以包含在您的提示词中。'],
        ['“Generate a hyper-realistic, studio-quality product ad...”', '“生成一则超逼真、具有专业影棚质感的产品广告...”'],
        ['AI Studio uses Google Drive to store apps, and inherits', 'AI Studio 使用 Google 云端硬盘存储应用，并会继承其'],
        ['Open model that can handle visual and text input with low latency.', '能够低延迟处理视觉和文本输入的开放模型'],
        ['Number of tokens accumulated before sliding the context window', '上下文窗口滑动前，累积的 Token (令牌) 数量'],
        [' This model is not stable and may not be suitable for production use. ', '此模型不稳定，不适合用于生产环境。'],
        [' “Create an image of fuzzy bunnies next to a glass of...” ', ' “创建一张毛茸茸的兔子在玻璃杯旁的图片...” '],
        ['Choose a system instructions configuration to use with the applet', '选择要与小程序一起使用的系统指令配置'],
        ['Gemini automatically generates a response for each function call.', 'Gemini 会为每个函数调用自动生成响应。'],
        ['Open model built for handling text-only tasks with low latency.', '为低延迟处理纯文本任务而构建的开放模型'],
        ['What terms apply to the Showcase apps featured in AI Studio?', 'AI Studio 中展示的精选应用需遵循哪些条款？'],
        ['Insert assets such as images, videos, folders, files, or audio', '插入图片、视频、文件夹、文件或音频等资源。'],
        ["'Item: Apple, Price: $1'. Extract name, price to JSON.", '从“商品：苹果，价格：$1”中提取名称和价格为 JSON。'],
        ['Drag, drop, and visualize any product in your personal space.', '在您的个人空间中拖放并可视化任何产品。'],
        ['Interleaved text-and-image generation with Gemini 2.0 Flash', '使用 Gemini 2.0 Flash 进行图文交错生成。'],
        ['You need to create and run a prompt in order to share it', '您需要先创建并运行提示词，然后才能进行分享。'],
        ['Add a negative prompt to define what should not be generated', '添加反向提示词，以排除不希望生成的内容'],
        ['Usage is reflective of all request types to the Gemini API.', '使用情况反映了Gemini API的所有请求类型'],
        ['Veo does not currently support uploading images with children.', 'Veo 目前不支持上传包含子元素的图片。'],
        [' “Create an image of sushi on a table, oil painting style.” ', ' “创建一张桌上寿司的图片，油画风格。” '],
        ['Closing the chat will lose the data. Do you want to continue?', '关闭后，当前对话内容将丢失。要继续吗？'],
        ['. Do not submit personal, sensitive, or confidential information. ', '。请勿提交个人、敏感或机密信息。'],
        ['Are you sure you want to clear? This action cannot be undone.', '您确定要清除对话吗？该操作不能撤消。'],
        [', and may be used to improve our services subject to our ', '，并可能根据我们的服务条款用于改进服务'],
        ['A photorealistic long exposure photograph of a subway platform', '一张地铁站台的写实风格长曝光照片'],
        ['Provide Gemini with functions it can use to create responses', '为 Gemini 提供可用于生成回复的函数'],
        ['The fastest path from prompt to production with Gemini', '借助 Gemini，轻松实现从提示词到生产的飞跃'],
        [' “A vintage-style poster advertising a local coffee.” ', ' “一则为本地咖啡馆宣传的复古风格海报。” '],
        ['(API pricing per 1M tokens, UI remains free of charge)', '（API 定价：每百万 Tokens，界面可免费使用）'],
        ['Please tell us more about the reason for your feedback (optional)', '请详细说明您反馈的原因（选填）'],
        [' “Create an image of a futuristic cityscape with...” ', ' “创建一张具有未来感的城市景观图片...” '],
        ['Generate a high school revision guide on quantum computing', '生成一份关于量子计算的高中复习指南'],
        ['Interactively create, control, and perform music in the moment', '实时、交互地创作、控制和演奏音乐'],
        ["I'm breaking down your instructions into actionable steps", '我正在将您的指令分解为可操作的步骤'],
        ['Steer a continuous stream of music with text prompts', '通过文本提示词，实时控制生成的连续音乐流'],
        ['You can change the display name and description of your app.', '您可以更改应用的显示名称和描述。'],
        ['You do not need to set an API key to use the free tier.', '您无需设置 API 密钥即可使用免费套餐。'],
        ['Create a live agent using bidirectional streaming', '使用双向流式传输技术，创建一个实时对话助手'],
        ['Create clips & animate images using generative video', '使用生成式视频创建短片并为图片制作动画'],
        ['The entire contents of your chat history with the Code Assistant', '您与代码助手的完整聊天记录'],
        [' “Create an image of rolling countryside landscape... ” ', '“创建一张连绵起伏的乡村风景图...”'],
        ['Live mix musical prompts with a MIDI controller', '使用 MIDI 控制器实时混合由提示词生成的音乐'],
        ['This tool is not compatible with the current active tools.', '此工具与当前已启用的工具不兼容。'],
        [' “Create a close-up of a dew-covered spider web ...” ', '“创建一张挂满露珠的蜘蛛网的特写...”'],
        ['No apps created yet. Build your first app now.', '尚未创建任何应用。立即创建您的第一个应用吧！'],
        ['The following settings are available for your code editor.', '以下是您的代码编辑器可用的设置'],
        ['Make changes, add new features, ask for anything', '您可以进行修改、添加新功能或提出任何要求'],
        ['Try native image model effects with your webcam.', '通过您的网络摄像头尝试原生图像模型效果。'],
        ['“Draw an intricate, picturesque pencil sketch of Du...”', '“画一幅精美、风景如画的铅笔素描”'],
        ['Add new features or easily modify this app with a prompt', '添加新功能或轻松修改此应用程序'],
        ['Explore the Veo 3 gallery and remix an example', '浏览 Veo 3 案例库，并选择一个进行二次创作'],
        ['Files over 1MB are not included in the code.', '大于 1MB 的文件内容不会被包含到应用代码中。'],
        ['How can I access the microphone, webcam, and other', '如何访问麦克风、网络摄像头和其他设备？'],
        ['Low latency, high volume tasks which require thinking', '需要复杂推理的低延迟、高吞吐量任务'],
        ['Experience the multimodal model from Google DeepMind', '体验 Google DeepMind 的多模态模型'],
        ['“Generate a sequence of images to produce a step...”', '“生成一系列图片，用于制作分步...”'],
        ['Explain the probability of rolling two dice and getting 7', '解释掷两个骰子得到 7 的概率'],
        ['Explore multimodal native image generation and editing', '探索多模态图像的生成和编辑功能'],
        ['Extract price from a string and format it as JSON', '从字符串中提取价格，并格式化为 JSON。'],
        ['The number of free generations that are remaining for this model', '此模型的免费生成次数'],
        ['Toggle thinking budget between auto and manual', '在自动和手动模式间切换模型的“思考预算”'],
        ['Let Gemini execute Python code in a sandbox', '允许 Gemini 在沙盒环境中执行 Python 代码'],
        ['Prompt Gemini in this simple example', '通过这个简单的示例，学习如何向 Gemini 发出提示词'],
        ['Always show regardless of probability of being harmful', '一律显示（不过滤潜在有害内容）'],
        ['Can I use Next.js, Svelte, Vue or Astro?', '我可以使用 Next.js、Svelte、Vue 或 Astro 吗？'],
        ['Enable sticky scroll to show the nested code blocks.', '启用粘性滚动以显示嵌套的代码块'],
        ['Generate high-quality text-to-speech with Gemini', '使用 Gemini 生成高质量的文本转语音'],
        ['Generate Python code for a simple calculator app', '为简单的计算器应用生成 Python 代码'],
        ['Imagen makes mistakes, so double-check it', 'Imagen 生成的内容可能存在错误，请仔细核对。'],
        ['Quickly batch test prompts with visual outputs.', '快速批量测试提示词并查看可视化输出。'],
        ['Top P set of tokens to consider during generation.', 'Top-P 采样：控制生成文本的多样性。'],
        ['Type something or tab to choose an example prompt', '输入内容或按 Tab 键选择示例提示词'],
        ['Block low, medium and high probability of being harmful', '屏蔽低、中、高风险的有害内容'],
        ['Google AI Studio and the Gemini API Status', 'Google AI Studio 和 Gemini API 运行状态'],
        ['Start writing or paste text here to generate speech', '在此处输入或粘贴文本以生成语音'],
        ['Generate high quality text to speech with Gemini', '使用 Gemini 生成高质量文本到语音'],
        ['Optional tone and style instructions for the model', '为模型提供可选的语气和风格指令'],
        ['Search a custom set of images using natural language.', '使用自然语言搜索自定义图集。'],
        ['Stream responses containing both images and text', '流式传输包含图片和文本的回复内容'],
        ['You have unsaved changes. Do you want to save first?', '您有未保存的更改。要先保存吗？'],
        ['Design a REST API for a social media platform.', '为社交媒体平台设计一个 REST API。'],
        ['Convert unorganized text into structured tables', '将非结构化文本转换为结构化表格'],
        ['Count how many tokens are in a piece of text', '计算一段文本中有多少 Token (令牌)'],
        ['Large scale processing (e.g. multiple pdfs)', '大规模处理（例如，处理多个 PDF 文件）'],
        ['Select an image or video to add to the prompt', '选择要添加到提示词中的图像或视频'],
        ['There is no billing currently set up for this project', '当前没有为此项目设置账单'],
        ['Control real time music with a MIDI controller.', '使用 MIDI 控制器控制实时音乐。'],
        ['Tackle difficult code, math and STEM problems', '应对复杂的代码、数学和 STEM 难题'],
        ['Veo makes mistakes, so double-check it', 'Veo 生成的内容可能存在错误，请仔细核对。'],
        ['Audio recording will be added to your prompt', '音频录音将被添加到您的提示词中。'],
        ["What's wrong? How can the response be improved?", '回复内容有什么问题？如何改进？'],
        ['Select a Google Cloud project to proceed:', '选择一个 Google Cloud 项目来继续：'],
        ['Unable to disable thinking mode for this model.', '无法为此模型关闭“思考”模式。'],
        ['A vintage-style poster of a local coffee shop', '一张本地咖啡店的复古风格海报'],
        ['Are you sure you want to delete this API key?', '你确定想要删掉该 API 密钥吗？'],
        ['Get recipe ideas based on an image of ingredients', '根据食材图片获取食谱创意'],
        ['How can I manage npm packages and their versions?', '如何管理 npm 包及其版本？'],
        ['Insert a text file to add it to your prompt.', '将文本文件添加至您的提示词中。'],
        ['Is my API key exposed when sharing apps?', '分享应用时，我的 API 密钥会泄露吗？'],
        ['The entire contents of all of the files of your app', '您应用中的所有文件内容'],
        ['Access Gemini models with the OpenAI SDK', '使用 OpenAI SDK 访问 Gemini 模型'],
        ['Block medium or high probability of being harmful', '屏蔽中、高风险的有害内容'],
        ['Render indentation guides for each line of code.', '为每行代码渲染缩进参考线'],
        ['The text wraps around the edges of the editor.', '文本将在编辑器边缘自动换行'],
        ['Use Gemini to read a disclaimer, really fast', '使用 Gemini 快速朗读免责声明'],
        ['Get Started with Gemini 2.5 Flash Image', '开始使用 Gemini 2.5 Flash Image '],
        ['Can I run apps outside of AI Studio?', '我可以在 AI Studio 之外运行应用吗？'],
        ['Generate logo and swag ideas for a brand', '为品牌构思 Logo 和周边产品创意'],
        ['Imagen makes mistakes, so double-check it.', 'Imagen会出错，所以请仔细检查。'],
        ['Loading your Google Cloud projects...', '正在加载您的 Google Cloud 项目...'],
        ['Render the minimap with the file overview.', '渲染带有文件概览的代码缩略图'],
        ["This model doesn't support System Instructions.", '此模型不支持“系统指令”。'],
        ['Write a quantum computing guide for students', '为学生编写一份量子计算指南'],
        ['You can only add one image to the prompt.', '您只能向提示词中添加一张图片。'],
        ['A high resolution image of a butterfly wing', '一张高分辨率的蝴蝶翅膀图片'],
        ['Include prompt history in generated code', '在生成的代码中包含提示词记录'],
        ['Insert a PDF to add it to your prompt.', '将 PDF 文件添加至您的提示词中。'],
        ['Sample from Imagen models to generate images', '调用 Imagen 模型生成图片'],
        ['Screenshot will be added to your prompt', '屏幕截图将添加到您的提示词中。'],
        ['Calculate text embeddings for use in RAG', '为 RAG 应用计算文本嵌入向量'],
        ['Control real time music with text prompts', '通过文本提示词控制实时音乐'],
        ["Define what you don't want to see", '描述您不希望在生成内容中看到的事物'],
        ['Enable folding to collapse code blocks.', '启用代码折叠功能以收起代码块'],
        ['How can I use GitHub with my apps?', '如何将 GitHub 与我的应用搭配使用？'],
        ['The ratio of width to height of the generated image', '生成图片的宽高比'],
        [' Fetch real-time information from web links ', '从网页链接获取实时信息'],
        ['An image of a fictional soda advertisement', '一张虚构的苏打水广告图片'],
        ['Insert an image to add it to your prompt.', '将图片添加至您的提示词中。'],
        ['Maximum number of tokens in response', '回复内容的最大 Token (令牌) 数'],
        ['Show conversation with markdown formatting', '以 Markdown 格式显示对话'],
        ["This model doesn't support System instructions", '此模型不支持系统指令'],
        ['Calculate and explain a probability problem', '计算并解释一个概率问题'],
        ['Image to a JSON structured recipe', '将食材图片转换为 JSON 格式的食谱'],
        ['Need some inspiration? See examples in', '需要灵感？不妨看看这里的示例'],
        ['Show conversation without markdown formatting', '以纯文本格式显示对话'],
        ['Test if AI knows which number is bigger', '测试 AI 是否能判断数字大小'],
        [' if you have anything specific in mind. ', '，如果您有任何具体的想法。'],
        ['Ask questions about key details in a video', '就视频中的关键细节提问'],
        ['Dynamic text game using Gemini', '使用 Gemini 打造的动态文字冒险游戏'],
        ['Example chat app built with Gemini', '使用 Gemini 构建的聊天应用示例'],
        ['Ground responses with Google Search.', '基于 Google 搜索结果生成回复'],
        ['Output format that the model should generate', '模型应生成的输出格式'],
        ['Remove prompt image from Drive', '从 Google 云端硬盘中删除提示词图片'],
        ['Render the line numbers for each line of code.', '为每行代码渲染行号'],
        ['The output resolution of the generated media', '生成媒体的输出分辨率'],
        ['This model generates one image at a time', '此模型一次仅生成一张图片'],
        ['Get SDK code to chat with Gemini', '获取 Gemini 聊天功能的 SDK 代码'],
        ['Select an image from Google Drive', '从 Google 云端硬盘选择一张图片'],
        ['Select an image from the sample gallery', '从示例图库中选择一张图片'],
        ['Select Cloud Project to use paid tier', '选择要用于付费服务的云项目'],
        ['Temporary chat is not available for Veo', '临时聊天功能不适用于 Veo'],
        [' to constrain the model output. See the ', ' 来约束模型输出。请参阅'],
        [', so the API key is no longer exposed. ', '，从而避免 API 密钥泄露。'],
        ['Add unit tests for a Python function', '为 Python 函数添加单元测试'],
        ['Are you sure you want to delete this app?', '您确定要删除此应用吗？'],
        ['Sample from Veo models to generate videos', '调用 Veo 模型生成视频'],
        ['Select an image to add to the prompt', '选择一张图片添加到提示词中'],
        ['What did you like about the response?', '你喜欢这个回复的哪些方面？'],
        ['before using the code in your project', '在您的项目中使用此代码前'],
        ['Failed to list projects. Please try again.', '列出项目失败，请重试'],
        ['Gemini API Additional Terms of Service', 'Gemini API 附加服务条款'],
        ['Generate a confusion matrix in Python', '使用 Python 生成混淆矩阵'],
        [' Generate native speech with Gemini ', '使用 Gemini 生成原生语音'],
        ['Design a social media platform API', '设计一个社交媒体平台的 API'],
        ['Get SDK code to generate an image', '获取用于生成图片的 SDK 代码'],
        ['Remove app from recent apps list', '从“最近使用”列表中移除此应用'],
        ['Video will be added to your prompt', '视频将被添加到您的提示词中'],
        [' Fetch information with URL context ', '使用 URL 上下文获取信息'],
        ['“Create a stylized 3D clay...”', '“创建一个风格化的 3D 粘土...”'],
        ['Block high probability of being harmful', '屏蔽高风险的有害内容'],
        ['Example React app using Gemini', '使用 Gemini 的 React 应用示例'],
        ['Voice used to generate audio output.', '用于生成音频输出的音色。'],
        ['Enable or disable thinking for responses', '启用或禁用思考模式'],
        ['Photo will be added to your prompt', '照片将添加到您的提示词中'],
        [' Gemini powered code review tool ', '基于Gemini的代码审核工具'],
        ['Craft a blog post with an image', '撰写一篇图文并茂的博客文章'],
        ['Solve different quadratic equations.', '解不同的一元二次方程。'],
        ['Stream images and video in realtime', '实时流式传输图片和视频'],
        ['Create a Python calculator app', '创建一个 Python 计算器应用'],
        ['Get Started with the Gemini JS SDK', 'Gemini JS SDK 入门指南'],
        ['Grounding with Google Search', '基于 Google 搜索结果生成内容'],
        ['Identify elements in a hurricane chart', '识别飓风图中的元素'],
        ['No Google Cloud projects found.', '未找到 Google Cloud 项目。'],
        ['Render the text with font ligatures.', '使用字体连字渲染文本'],
        ['Show the thinking process of the model', '显示模型的思考过程'],
        ['Find the next shape in a sequence', '找出序列中的下一个形状'],
        ['Get SDK code to generate a video', '获取生成视频的 SDK 代码'],
        ['Identify and care for your plants', '识别植物并提供养护建议'],
        ['Solve geometry problems with an image', '通过图片解答几何题'],
        ['Cannot be empty or contain only spaces.', '内容不能为空白。'],
        ['Create regex from text input', '根据文本输入创建正则表达式'],
        ['Expand or collapse advanced settings', '展开或收起高级设置'],
        ['Generate interleaved text and images', '生成图文交错的内容'],
        ['Get SDK code to generate speech', '获取生成语音的 SDK 代码'],
        ['LearnLM 2.0 Flash Experimental', 'LearnLM 2.0 Flash 实验版'],
        ['No prompts match your search', '没有与您的搜索相匹配的对话'],
        ['Our current state of the art model', '我们当前的最先进模型'],
        [' Recipe generator using Gemini ', '使用Gemini的食谱生成器'],
        ['An image of a San Francisco stamp', '一张旧金山邮票的图片'],
        ['Design a custom birthday card.', '设计一张定制的生日贺卡。'],
        ['Expand to view model thoughts', '展开以查看模型的思考过程'],
        [' “Create a vintage movie ... ” ', '“创建一个复古电影...”'],
        [' Build with the Gemini API  ', '使用 Gemini API 进行构建'],
        ['Adjust harmful response settings', '调整有害内容过滤设置'],
        ['Call tools natively, like Search', '原生调用“搜索”等工具'],
        ['Deploy app on Google Cloud', '在 Google Cloud 上部署应用'],
        ['Expand or collapse navigation menu', '展开或收起导航菜单'],
        ['Fetch information from web links', '从网页链接中获取信息'],
        ['Make a new copy in Drive', '在 Google 云端硬盘中创建副本'],
        ['Start typing dialog here...', '在此处开始输入对话内容...'],
        ['Summarizing image and text content', '总结图片和文本内容'],
        ['Your conversation won’t be saved', '你的对话将不会被保存'],
        ['Create a custom birthday card', '制作一张定制的生日贺卡'],
        ['File upload failed: undefined ', '文件上传失败：未知错误'],
        ['Find and update time complexity', '分析并优化时间复杂度'],
        ['moving some logic server-side', '将部分逻辑移至服务器端'],
        ['Restore code from this checkpoint', '从此检查点恢复代码'],
        ['Save the prompt before sharing it', '分享前请先保存对话'],
        ['Summarizing text research content', '总结研究性文本内容'],
        [' “Create a Macro photog... ” ', '“创建一张微距摄影...”'],
        ['30 RPM 14400 req/day', '每分钟 30 次请求，每天 14400 次'],
        ['Are you sure you want to clear?', '你确定要清空对话吗？'],
        ['Gemini powered code review', '由 Gemini 赋能的代码审核'],
        ['Image (*Output per image)', '图片（*每张图片的输出成本）'],
        ['Learn more about Gemini models', '详细了解 Gemini 模型'],
        ['No recording devices available.', '没有可用的录制设备。'],
        ['Search Google Cloud projects', '搜索 Google Cloud 项目'],
        ['Start Time (e.g., 1m10s)', '开始时间 (例如，1 分 10 秒)'],
        ['Choose Google Cloud project', '选择 Google Cloud 项目'],
        ['Collapse to hide model thoughts', '收起模型的思考过程'],
        ['Image of a futuristic cityscape', '未来城市景观的图片'],
        ['Image of an afternoon tea table', '一张下午茶桌的图片'],
        ['Model used to generate response', '用于生成回复的模型'],
        ['Your response is Feedback under the', '您的反馈将遵循'],
        [', by running the following code:', '，请运行以下代码：'],
        ['10 RPM 1500 req/day', '每分钟 10 次请求，每天 1500 次'],
        ['15 RPM 1500 req/day', '每分钟 15 次请求，每天 1500 次'],
        ['30 RPM 1500 req/day', '每分钟 30 次请求，每天 1500 次'],
        ['Add an image to the prompt', '向提示词中添加一张图片'],
        ['Analyze the sentiment of texts', '分析文本的情感倾向'],
        ['No issues recorded on this day', '今天没有记录的问题'],
        ['Write a Docker set up script', '编写 Docker 设置脚本'],
        ['You can deploy your app to', '您可以将您的应用部署到'],
        ['Edit app name and description', '编辑应用名称和描述'],
        ['End Time (e.g., 2m30s)', '结束时间(例如，2 分 30 秒)'],
        ['Gemini API Usage & Billing', 'Gemini API 用量和结算'],
        ['Generate images with Imagen', '使用 Imagen 生成图片'],
        ['Number of images to be returned', '要生成的图片数量'],
        ['Number of videos to be returned', '要生成的视频数量'],
        ['Take a photo with your camera', '使用您的摄像头拍照'],
        ['Total API Requests per day', '每天的总 API 请求次数'],
        ['15 RPM 500 req/day', '每分钟 15 次请求，每天 500 次'],
        ['Add items to file explorer', '添加文件到文件管理器'],
        ['Chat | Google AI Studio', '聊天 | Google AI Studio'],
        ['Exporting image to Drive', '正在导出图像到云端硬盘'],
        ['Generate a story with images', '生成图文并茂的故事'],
        ['Look up API Key for project', '查找项目的 API 密钥'],
        ['Process 10,000 lines of code', '处理 10,000 行代码'],
        ['Reason over complex problems', '对复杂问题进行推理'],
        ['Run code changes automatically', '自动运行代码变更'],
        ['See changes in version history', '查看版本历史记录'],
        [' Knowledge cut off: Unknown ', '知识截止日期：未知'],
        ['Imagen pixel art maker', 'Imagen 像素风艺术生成器'],
        ['Restore app to this version', '将应用恢复到此版本'],
        ['Run the app (Ctrl+Enter)', '运行应用 (Ctrl+Enter)'],
        ['are a subset of the standard', '是标准的一个子集'],
        ['Copy prompt to clipboard', '将提示词复制到剪贴板'],
        ['Create custom product images', '创建自定义产品图'],
        ['Excitable, Lower middle pitch', '易激动，中低音调'],
        ['Image of a house in a forest', '森林中房子的图片'],
        ['Knowledgeable, Middle pitch', '知识渊博，中等音调'],
        ['You can run this prompt from the', '您可以运行从'],
        ['Are you sure you want to delete', '你确定要删除'],
        ['Easy-going, Lower middle pitch', '随和，中低音调'],
        ['Gemini 2.5 Flash Audio', 'Gemini 2.5 Flash 音频'],
        ['Informative, Lower pitch', '信息丰富的，较低音调'],
        ['Input Token Count per Day', '每日输入 Tokens 量'],
        ['No Cloud Projects Available', '没有可用的云项目'],
        ['Scroll to previous prompt', '滚动到上一条提示词'],
        ['Total API Errors per day', '每天的 API 错误总数'],
        ['Use Gemini to greet you', '使用 Gemini 向您问好'],
        [' Try Nano Banana ', '尝试 Nano Banana 图像模型'],
        ['A knit countryside image', '一张针织乡村风景图'],
        ['Build apps with Gemini', '使用 Gemini 构建应用'],
        ['Collapse prompts history', '收起提示词历史记录'],
        ['Copied link to clipboard', '已复制链接到剪贴板'],
        ['Informative, Middle pitch', '信息丰富，中等音调'],
        ['Input Tokens per day', '每天的输入 Tokens 次数'],
        ['Input/Output API Pricing', '输入/输出 API 定价'],
        ['Only one option is supported', '仅支持一个选项'],
        ['Open in new window', '在新窗口中打开（进入凭证）'],
        ['policy-controlled features', '受策略控制的功能'],
        ['All Systems Operational', '所有系统均正常运行'],
        ['Friendly, Lower middle pitch', '友好的，中低音'],
        ['Generate videos with Veo', '使用 Veo 生成视频'],
        ['OpenAI SDK compatibility', 'OpenAI SDK 兼容性'],
        ['Use Google AI Studio', '使用 Google AI Studio'],
        ['? This cannot be undone. ', '该操作不可撤销。'],
        ['Close run settings panel', '关闭运行设置面板'],
        ['Edit title and description', '编辑标题和描述'],
        ['Expand prompts history', '展开提示词历史记录'],
        ['Image of fuzzy bunnies', '毛茸茸的兔子的图片'],
        ['Plot a trigonometric graph', '绘制三角函数图'],
        ['System instructions template', '系统指令模板'],
        ['Time to first token: ', '首个Tokens响应时间：'],
        ['Visual and text processing', '视觉和文本处理'],
        ['“name” must be specified', '“name” 必须指定'],
        ['Automatic Function Response', '自动函数响应'],
        ['Casual, Lower middle pitch', '随意的，中低音'],
        ['Delete function declaration', '删除函数声明'],
        ['Do not run safety filters', '禁用安全过滤器'],
        ['Easy-going, Middle pitch', '随和的，中等音调'],
        ['Gemini speech generation', 'Gemini 语音生成'],
        ['Image of sushi on a table', '桌上寿司的图片'],
        ['Mark property as optional', '标记属性为可选'],
        ['Render indentation guides', '渲染缩进参考线'],
        ['Scroll to next prompt', '滚动到下一条提示词'],
        ['Who can see my apps?', '谁可以查看我的应用？'],
        ['Advanced share permissions', '高级共享权限'],
        ['Aspect ratio of the videos', '视频的宽高比'],
        ['Checking for API keys', '正在检查 API 密钥'],
        ['Clear, Lower middle pitch', '清晰的，中低音'],
        ['create an API key.', '请创建一个 API 密钥。'],
        ['Expand or collapse tools', '展开或收起工具'],
        ['Gemini image generation', 'Gemini 图像生成'],
        ['Google AI Studio', 'Google AI 开发者工作台'],
        ['Live audio-to-audio dialog', '实时音频对话'],
        ['See original conversations', '查看原始对话'],
        ['Send a file to the model', '向模型上传文件'],
        ['Thanks for your feedback!', '感谢您的反馈！'],
        ['The issue has been resolved.', '问题已解决'],
        ['A sci-fi movie poster', '一张科幻电影海报'],
        ['Breathy, Lower pitch', '气息感的，较低音调'],
        ['Code Assistant messages', '代码助手的消息'],
        ['Combine images of flowers', '组合花卉图像'],
        ['Create generative media', '创建生成式媒体'],
        ['Create Generative Media', '创建生成式媒体'],
        ['Even, Lower middle pitch', '平稳的，中低音'],
        ['Firm, Lower middle pitch', '坚定的，中低音'],
        ['Gemini API Billing', 'Gemini API 计费账单'],
        ['Maximum output tokens', '最大输出Tokens数'],
        ['OpenAPI schema object', 'OpenAPI 架构对象'],
        ['See details on our ', '查看我们的详细信息'],
        ['See original conversation', '查看原始对话'],
        ['Select media resolution', '选择媒体分辨率'],
        ['Select or upload a file', '选择或上传文件'],
        ['Talk to Gemini live', '与 Gemini 实时交谈'],
        ['Youthful, Higher pitch', '年轻的，较高音调'],
        [' Explore Past Forward ', '探索过去到未来'],
        ['503 ServiceUnavailable', '503 服务不可用'],
        ['Add function declaration', '添加函数声明'],
        ['Analyze a research paper', '分析研究论文'],
        ['Create a scavenger hunt.', '创建寻宝游戏'],
        ['Create your API key', '创建您的 API 密钥'],
        ['Forward, Middle pitch', '有力的，中等音调'],
        ['FPS (frames per second)', 'FPS（每秒帧数）'],
        ['Gravelly, Lower pitch', '沙哑的，较低音调'],
        ['Make property an array', '将属性设为数组'],
        ['Native speech generation', '原生语音生成'],
        ['Not following instructions', '未遵循指示'],
        ['Open in Vertex AI', '在 Vertex AI 中打开'],
        ['Reload recent apps', '重新加载最近的应用'],
        ['Resolution of the videos', '视频的分辨率'],
        ['Already in a new chat', '当前已是新会话'],
        ['Breezy, Middle pitch', '轻松的，中等音调'],
        ['Bright, Higher pitch', '明亮的，较高音调'],
        ['Bright, Middle pitch', '明亮的，中等音调'],
        ['Deleting prompt...', '正在删除提示词...'],
        ['Deploy to Cloud Run', '部署到 Cloud Run'],
        ['Description of the function', '函数描述'],
        ['Gentle, Middle pitch', '温柔的，中等音调'],
        ['Mature, Middle pitch', '成熟的，中等音调'],
        ['Native image generation', '原生图像生成'],
        ['Smooth, Middle pitch', '平滑的，中等音调'],
        ['Start typing a prompt', '开始输入提示词'],
        ['Upbeat, Higher pitch', '欢快的，较高音调'],
        ['Upbeat, Middle pitch', '欢快的，中等音调'],
        ['Video to Learning App', '视频转学习应用'],
        ['A banyan tree building', '一座榕树建筑'],
        ['Browse the url context', '浏览网页内容'],
        ['Change All Occurrences', '更改所有出现'],
        ['Clear, Middle pitch', '清晰的，中等音调'],
        ['Close file tree view', '关闭文件树视图'],
        ['developer guide docs', '开发者指南文档'],
        ['Frame rate of the videos', '视频的帧率'],
        ['Harmful or offensive', '有害或令人反感'],
        ['Here are the changes:', '更改内容如下：'],
        ['Issue has been resolved.', '问题已解决'],
        ['Lively, Lower pitch', '活泼的，较低音调'],
        ['Multimodal understanding', '多模态理解'],
        ['No changes to save', '没有要保存的更改'],
        ['Or try some examples', '或尝试一些示例'],
        ['Prompt suggestion card', '提示建议卡片'],
        ['Reset default settings', '重置默认设置'],
        ['Select the model voice', '选择模型音色'],
        ['Sharing prompt...', '正在分享提示词...'],
        ['Skip to main content', '跳转到主要内容'],
        ['Smooth, Lower pitch', '平滑的，较低音调'],
        ['Try an example app', '尝试一个示例应用'],
        ['View older generations', '查看历史记录'],
        [' Current screen size ', '当前屏幕大小'],
        ['All context lengths', '所有上下文长度'],
        ['Audio voice assistant', '音频语音助手'],
        ['Collapse code snippet', '折叠代码片段'],
        ['Copied to clipboard', '已复制到剪贴板'],
        ['Delete speaker dialog', '删除此段发言'],
        ['Firm, Middle pitch', '坚定的，中等音调'],
        ['from AI Studio', '在 AI Studio 中运行'],
        ['Gemma Terms of Use', '《Gemma使用条款》'],
        ['Multimodal Live API', '多模态实时 API'],
        ['Output token cost:', '输出 Token 成本'],
        ['Request Count per Day', '每天请求计数'],
        ['Select device preview', '选择设备预览'],
        ['Show file tree view', '显示文件树视图'],
        ['Soft, Higher pitch', '柔和的，较高音调'],
        ['Target context size', '目标上下文大小'],
        ['Total API Requests', '总 API 请求次数'],
        ['Use Google Search', '使用 Google 搜索'],
        ['Warm, Middle pitch', '温暖的，中等音调'],
        [', after installing the ', '，安装之后'],
        ['Answer took too long', '响应时间过长'],
        ['Audio-Video Generation', '音视频生成'],
        ['Duration of the videos', '视频的时长'],
        ['Edit safety settings', '编辑安全设置'],
        ['Gemini Co-Drawing', 'Gemini 协同绘画'],
        ['giving us feedback', '向我们提供反馈'],
        ['Input token cost:', '输入 Token 成本'],
        ['Large scale processing', '大规模处理'],
        ['Magical GIF Maker', '神奇 GIF 制作器'],
        ['Open editor settings', '打开编辑设置'],
        ['Open navigation menu', '打开导航菜单'],
        ['Switch to API key', '切换到 API 密钥'],
        ['Text safety settings', '文本安全设置'],
        ['Toggle thinking mode', '切换思考模式'],
        ['Tokens per second: ', '每秒Tokens数：'],
        ['Upload a local image', '上传本地图像'],
        ['429 TooManyRequests', '429 过多请求'],
        ['Adjust writing tone', '调整写作语气'],
        ['Call tools natively', '原生调用工具'],
        ['Character consistency', '角色一致性'],
        ['Copy as markdown', '复制为 Markdown'],
        ['Describe your image', '描述您的图像'],
        ['Describe your video', '描述您的视频'],
        ['Expand code snippet', '展开代码片段'],
        ['Gemini API Usage', 'Gemini API 使用'],
        ['Hide Code Assistant', '隐藏代码助手'],
        ['its permissions model', '其权限模型'],
        ['Make the app fullscreen', '全屏显示'],
        ['Multimodal generation', '多模态生成'],
        ['No matching results', '没有匹配结果'],
        ['Not factually correct', '事实不准确'],
        ['Open in Cloud Console', '进入云终端'],
        ['Rerun this turn', '重新运行当前步骤'],
        ['Run safety settings', '应用安全设置'],
        ['Set thinking budget', '设置思考预算'],
        ['Show Code Assistant', '显示代码助手'],
        ['Speaker 1 settings', '发言人 1 设置'],
        ['Speaker 2 settings', '发言人 2 设置'],
        ['Start from a template', '从模板开始'],
        ['Unsaved changes', '存在未保存的更改'],
        ['Animate an image', '为图像制作动画'],
        ['Branch from here', '从此处创建分支'],
        ['Copying prompt...', '复制副本中...'],
        ['create an API key', '创建 API 密钥'],
        ['Create an API Key', '创建 API 密钥'],
        ['Delete API key', ' 删除该 API 密钥'],
        ['Google Maps API', 'Google 地图 API'],
        ['Hide code editor', '隐藏代码编辑器'],
        ["It's time to build", '即刻开始构建'],
        ['Max context size', '最大上下文大小'],
        ['Movie scene script', '电影场景脚本'],
        ['Multiple speaker audio', '多人音频'],
        ['Navigator APIs?', 'Navigator APIs？'],
        ['Open in Kaggle', '在 Kaggle 中打开'],
        ['Open settings menu', '打开设置菜单'],
        ['Realtime streaming', '实时流式传输'],
        ['Requests per day', '每天的请求次数'],
        ['Reset the conversation', '重置对话'],
        ['Saved to Drive', '已保存到云端硬盘'],
        ['Show code editor', '显示代码编辑器'],
        ['Supported values for ', '支持的值：'],
        ['View Gemini API', '查看 Gemini API'],
        ['YouTube URL', 'YouTube 视频URL链接'],
        [' Output resolution ', '输出分辨率'],
        ['Add stop sequence', '添加停止序列'],
        ['Back to prompts', '返回提示词列表'],
        ['Choose a template', '选择一个模板'],
        ['Copy to clipboard', '复制到剪贴板'],
        ['Create new folder', '创建新文件夹'],
        ['data use policy', '《数据使用政策》'],
        ['Export to Drive', '导出到云端硬盘'],
        ['file. For example, ', '文件。例如，'],
        ['Function declarations', '函数声明'],
        ['How do apps run?', '应用如何运行？'],
        ['Open in Drive', '在云端硬盘中打开'],
        ['Saving to Drive', '保存到云端硬盘'],
        ['Show run settings', '显示运行设置'],
        ['Spatial Understanding', '空间理解'],
        ['View All Libraries ', '查看所有库'],
        ['View more actions', '查看更多操作'],
        ['App file changes', '应用文件变更'],
        ['Defaults to 1 FPS', '默认为1 FPS'],
        ['Edit name of app', '编辑应用名称'],
        ['Loading projects', '正在加载项目'],
        ['Lyria RealTime', 'Lyria 实时交互'],
        ['MCP Maps Basic', 'MCP 地图基础版'],
        ['Name of the function', '函数名称'],
        ['Native image gen', '原生图像生成'],
        ['object consistency', '对象一致性'],
        ['Open in Colab', '在 Colab 中打开'],
        ['Podcast transcript', '播客文字稿'],
        ['Publish your app', '发布您的应用'],
        ['Record new audio', '录制新的录音'],
        ['Restore checkpoint', '恢复检查点'],
        ['Select a project', '选择一个项目'],
        ['Show in editor', '在编辑器中显示'],
        ['Single speaker audio', '单人音频'],
        ['Single-speaker audio', '单人音频'],
        ['Type of the property', '属性类型'],
        ['Upload text file', '上传文本文件'],
        ['URL context tool', '网页内容工具'],
        ['Visual understanding', '视觉理解'],
        ['Add to prompt', '添加到提示词中'],
        ['Agentic use cases', '智能体用例'],
        ['Audio transcription', '音频转录'],
        ['Data transformation', '数据转换'],
        ['Model Run Stats', '模型运行统计'],
        ['Multi-speaker audio', '多人音频'],
        ['Native tool use', '原生工具使用'],
        ['p5js playground', 'p5.js 演练场'],
        ['Ready to chat!', '准备好对话了！'],
        ['Search in files', '在文件中搜索'],
        ['Stream realtime', '实时流式传输'],
        ['Stream Realtime', '实时流式传输'],
        ['Structured output', '结构化输出'],
        ['System instructions', '系统指令'],
        ['System Instructions', '系统指令'],
        ['Untitled prompt', '无标题的对话'],
        ['Video understanding', '视频理解'],
        ['View full image', '查看完整图片'],
        ['(experimental)', '（实验性功能）'],
        ['<=200K tokens', '<=20 万Tokens'],
        ['> 200K tokens', '> 20 万Tokens'],
        ['400 BadRequest', '400 错误请求'],
        ['Add stop token', '添加停止标记'],
        ['Add stop...', '添加停止标记...'],
        ['Affective dialog', '情感化对话'],
        ['Chat with Docs', '与 Docs 聊天'],
        ['Copy markdown', '复制 Markdown'],
        ['Go to Symbol...', '转到符号...'],
        ['Media resolution', '媒体分辨率'],
        ['No data available.', '暂无数据'],
        ['Output tokens:', '输出 Tokens：'],
        ['Prompt history', '对话历史记录'],
        ['relevant package', '相关软件包'],
        ['Reload the app', '重新加载应用'],
        ['Reset defaults', '恢复默认设置'],
        ['Style instructions', '风格指令'],
        ['Advanced settings', '高级设置'],
        ['API documentation', 'API 文档'],
        ['Cancel generation', '取消生成'],
        ['Create new file', '创建新文件'],
        ['Dangerous Content', '危险内容'],
        ['Developer forum', '开发者论坛'],
        ['Flashcard Maker', '闪卡制作器'],
        ['Format Document', '格式化文档'],
        ['Input tokens:', '输入 Tokens：'],
        ['Leave full screen', '退出全屏'],
        ['Negative prompt', '反向提示词'],
        ['No Data Available', '暂无数据'],
        ['Number of results', '结果数量'],
        ['Proactive audio', '主动式音频'],
        ['Recent apps', '最近使用的应用'],
        ['Remove parameters', '移除参数'],
        ['Session Context', '会话上下文'],
        ['Sexually Explicit', '色情内容'],
        ['Usage & Billing', '用量与计费'],
        ['Veo 3 Gallery', 'Veo 3 作品库'],
        ['Visual Editor', '可视化编辑器'],
        ['YouTube Video', 'YouTube 视频'],
        ['Cost Estimation ', '成本估算'],
        ['Developer docs', '开发者文档'],
        ['Download the app', '下载应用'],
        ['Function calling', '函数调用'],
        ['Generate content', '生成内容'],
        ['Get API key', '获取 API 密钥'],
        ['Go to Definition', '转到定义'],
        ['Go to References', '转到引用'],
        ['Google Search', 'Google 搜索'],
        ['Imagen prompt', 'Imagen 对话'],
        ['Music generation', '音乐生成'],
        ['Script builder', '脚本生成器'],
        ['Sharing Prompt', '分享提示词'],
        ['Terms of service', '服务条款'],
        ['Text translation', '文本翻译'],
        ['to get started.', '即可开始。'],
        ['Video Analyzer', '视频分析器'],
        [' Back to start ', '返回开始'],
        ['Billing Support', '结算支持'],
        ['Code generation', '代码生成'],
        ['Command Palette', '命令面板'],
        ['Copy this app', '复制此应用'],
        ['Current version', '当前版本'],
        ['Delete property', '删除属性'],
        ['Dismiss all', '清空消息通知'],
        ['Editor settings', '编辑设置'],
        ['File explorer', '文件浏览器'],
        ['From revision', '从修订版本'],
        ['Full outage', '完全中断停机'],
        ['Generate speech', '生成语音'],
        ['Generated Image', '生成图像'],
        ['Good response', '优质的回复'],
        ['Image to Code', '图像转代码'],
        ['Images & text', '图像和文本'],
        ['Maps Explorer', '地图浏览器'],
        ['Model selection', '模型选择'],
        ['OK, got it', '好的，我明白了'],
        ['Peek Definition', '速览定义'],
        ['Peek References', '速览引用'],
        ['Prompts gallery', '提示词库'],
        ['React example', 'React 示例'],
        ['Rename Symbol', '重命名符号'],
        ['Safety settings', '安全设置'],
        ['Save this app', '保存此应用'],
        ['Select Language', '选择语言'],
        ['Start recording', '开始录制'],
        ['Submit feedback', '提交反馈'],
        ['Text generation', '文本生成'],
        ['Thinking budget', '思考预算'],
        ['Token Usage:', 'Token 使用：'],
        ['Total tokens:', '总 Tokens：'],
        ['Turn coverage', '轮次覆盖率'],
        [' Render Start ', '开始渲染'],
        [' Running for ', '运行时间 '],
        [' Take a photo ', '拍摄照片'],
        ['A spider web', '一张蜘蛛网'],
        ['Add parameters', '添加参数'],
        ['Are you sure?', '您确定吗？'],
        ['Bad response', '不佳的回复'],
        ['Campfire story', '篝火故事'],
        ['Code assistant', '代码助手'],
        ['Code Assistant', '代码助手'],
        ['Code execution', '代码执行'],
        ['Copy as text', '复制为文本'],
        ['Count tokens', '计算Tokens'],
        ['Delete content', '删除内容'],
        ['Explore models', '探索模型'],
        ['Font ligatures', '字体连字'],
        ['for examples.', '查看示例。'],
        ['Gemma models', 'Gemma 模型'],
        ['Generate Image', '生成图像'],
        ['Generate media', '生成媒体'],
        ['Generate Media', '生成媒体'],
        ['Generate Video', '生成视频'],
        ['Generative UI', '生成式 UI'],
        ['Google Maps', 'Google 地图'],
        ['Maps Planner', '地图规划器'],
        ['MCP Maps 3D', 'MCP 3D 地图'],
        ['Model settings', '模型设置'],
        ['Partial outage', '部分中断'],
        ['Past Incidents', '历史事件'],
        ['Privacy policy', '隐私政策'],
        ['Privacy Policy', '隐私政策'],
        ['Prompt gallery', '提示词库'],
        ['Select a model', '选择模型'],
        ['Set up billing', '设置账单'],
        ['Shared with me', '与我共享'],
        ['Stop recording', '停止录音'],
        ['Temporary chat', '临时聊天'],
        ['Thinking Space', '思考空间'],
        ['Transportation', '交通工具'],
        ['Video duration', '视频时长'],
        ['Video settings', '视频设置'],
        ['Voice settings', '语音设置'],
        ['What is this?', '这是什么？'],
        [' pricing page', '定价页面'],
        ['ChatterBots', '聊天机器人'],
        ['Code Editor', '代码编辑器'],
        ['Delete prompt', '删除对话'],
        ['Dictation App', '听写应用'],
        ['Download app', '下载该APP'],
        ['Edit an image', '编辑图像'],
        ['Image Editing', '图像编辑'],
        ['Infinite Wiki', '无限维基'],
        ['January 2025', '2025年1月'],
        ['Output format', '输出格式'],
        ['Output length', '输出长度'],
        ['Paint A Place', '描绘一处'],
        ['Raw structure', '原始结构'],
        ['Re-take photo', '重新拍照'],
        ['Send feedback', '发送反馈'],
        ['Send prompt', '发送提示词'],
        ['Sticky scroll', '粘性滚动'],
        ['Text wrapping', '文本换行'],
        ['Thinking mode', '思考模式'],
        ['To revision', '至修订版本'],
        ['Token count', 'Tokens计数'],
        ['Try Gemini', '体验 Gemini'],
        ['URL context', '网址上下文'],
        ['Use GitHub', '使用 GitHub'],
        ['A minute ago', '一分钟前'],
        ['Add property', '添加属性'],
        ['An empty app', '空白应用'],
        ['August 2024', '2024年8月'],
        ['Chat example', '聊天示例'],
        ['Compare mode', '比较模式'],
        ['First opened', '首次打开'],
        ['Hide preview', '隐藏预览'],
        ['Loaded app', '已加载应用'],
        ['Long Context', '长上下文'],
        ['More options', '更多选项'],
        ['My Drive', '我的云端硬盘'],
        ['Past Forward', '时光倒流'],
        ['Record Audio', '录制音频'],
        ['Remove image', '移除照片'],
        ['Remove video', '移除视频'],
        ['Rename app', '重命名应用'],
        ['Restored from', '恢复自：'],
        ['Run prompt', '运行提示词'],
        ['Run settings', '运行设置'],
        ['Sample Media', '媒体示例'],
        ['Scroll right', '向右滚动'],
        ['Share prompt', '分享对话'],
        ['Share Prompt', '分享对话'],
        ['Share Screen', '共享屏幕'],
        ['Show preview', '显示预览'],
        ['Stop editing', '停止编辑'],
        ['System theme', '系统主题'],
        ['Thinking...', '思考中...'],
        ['Upload files', '上传文件'],
        ['Upload Image', '上传图像'],
        ['URL Context', 'URL上下文'],
        ['Veo prompt', 'Veo 提示词'],
        [' documentation ', '文档'],
        ['Chat prompt', '聊天对话'],
        ['Chat Prompt', '聊天对话'],
        ['Coming Soon', '即将推出'],
        ['Get started', '开始使用'],
        ['Home Canvas', '家居画布'],
        ['Last opened', '上次打开'],
        ['Light theme', '浅色主题'],
        ['Loading...', '加载中...'],
        ['Make a copy', '创建副本'],
        ['Not helpful', '帮助不大'],
        ['Prompt name', '对话名称'],
        ['Rate limits', '速率限制'],
        ['Remove file', '移除文件'],
        ['Run the app', '运行应用'],
        ['Save prompt', '保存对话'],
        ['Save Prompt', '保存对话'],
        ['Scroll left', '向左滚动'],
        ['Streaming', '流式传输中'],
        ['Suggestions', '灵感建议'],
        ['Take screenshot', '截图'],
        ['Unavailable', '暂不可用'],
        ['Upload File', '上传文件'],
        ['View status', '查看状态'],
        [' Enter an ', '输入一个'],
        ['Add dialog', '添加对话'],
        ['All Models', '所有模型'],
        ['Aspect ratio', '宽高比'],
        ['Block most', '屏蔽多数'],
        ['Block some', '屏蔽部分'],
        ['Clear chat', '清空对话'],
        ['Close chat', '关闭聊天'],
        ['Close file', '关闭文件'],
        ['Dark theme', '深色主题'],
        ['Delete app', '删除应用'],
        ['Deploy app', '部署应用'],
        ['Disclaimer', '免责声明'],
        ['Large view', '大型视图'],
        ['Learn more', '了解详情'],
        ['Live Audio', '实时音频'],
        ['Lower cost', '更低成本'],
        ['Multilingual', '多语言'],
        ['My history', '历史记录'],
        ['Not modified', '未修改'],
        ['Render End', '渲染结束'],
        ['Saving...', '保存中...'],
        ['Saving…..', '保存中...'],
        ['Showcase.', '作品展示。'],
        ['Time Range', '时间范围'],
        ['Upload PDF', '上传 PDF'],
        ['Use Policy', '使用政策'],
        ['Add files', '添加文件'],
        ['Block few', '屏蔽少量'],
        ['Changelog', '更新日志'],
        ['Copy app', '复制该APP'],
        ['Copy Code', '复制代码'],
        ['Copy text', '复制文本'],
        ['Documentation', '文档'],
        ['Free tier', '免费套餐'],
        ['Low latency', '低延迟'],
        ['Minimap', '代码缩略图'],
        ['Move file', '移动文件'],
        ['Share app', '分享应用'],
        ['Summarization', '摘要'],
        ['Total cost:', '总成本'],
        ['VibeCheck', '氛围检查'],
        ['View diff', '查看差异'],
        ['View Docs', '查看文档'],
        ['Your apps', '您的应用'],
        [' Mobile ', '移动设备'],
        [' Tablet ', '平板设备'],
        [' tokens ', ' Tokens '],
        ['API Docs', 'API 文档'],
        ['API keys', 'API 密钥'],
        ['API Keys', 'API 密钥'],
        ['Architecture', '建筑'],
        ['Autosave', '自动保存'],
        ['Block none', '不屏蔽'],
        ['Checkpoint', '检查点'],
        ['Get code', '获取代码'],
        ['Identified', '已识别'],
        ['Line numbers', '行号'],
        ['Live API', '实时 API'],
        ['Multimodal', '多模态'],
        ['New chat', '新建聊天'],
        ['Resolution', '分辨率'],
        ['Save app', '保存应用'],
        ['should not', '不应当'],
        ['Showcase', '作品展示'],
        ['Studio', '开发工作台'],
        ['Thoughts', '思考过程'],
        ['Use case', '使用场景'],
        ['Webcam', '网络摄像头'],
        ["What's new", '新功能'],
        [' Ran for ', '运行了'],
        ['Close?', '要关闭吗？'],
        ['Dashboard', '仪表盘'],
        ['Description', '描述'],
        ['Folding', '代码折叠'],
        ['Full screen', '全屏'],
        ['History', '历史记录'],
        ['Mitigated', '已缓解'],
        ['Temperature', '温度'],
        ['Top P', 'Top-P 采样'],
        ['Translation', '翻译'],
        [' Featured ', '精选'],
        ['Best for', '最适合'],
        ['Deleting', '删除中'],
        ['Detected', '已检测'],
        ['Embeddings', '嵌入'],
        ['Failed', '任务失败'],
        ['Frame rate', '帧率'],
        ['Harassment', '骚扰'],
        ['Modified', '已修改'],
        ['New path', '新路径'],
        ['Parameters', '参数'],
        ['Resolved', '已解决'],
        ['Screencast', '截图'],
        ['screenshot', '截屏'],
        ['Screenshot', '截屏'],
        ['Stream', '流式传输'],
        ['System', '跟随系统'],
        ['Take photo', '拍照'],
        ['Thinking', '思考中'],
        [' Settings', '设置'],
        ['Light', '日间主题'],
        ['Reasoning', '推理'],
        ['Rerun', '重新运行'],
        ['Running', '运行中'],
        ['Tiny Cats', '小猫'],
        ['Unsaved', '未保存'],
        ['Updated', '更新于'],
        ['Yesterday', '昨天'],
        [' Device ', '设备'],
        [' Images ', '图像'],
        ['Camera', '摄像头'],
        ['Continue', '继续'],
        ['Dark', '夜间主题'],
        ['Download', '下载'],
        ['Edited', '已编辑'],
        ['Hate', '仇恨言论'],
        ['Messages', '消息'],
        ['Optional', '可选'],
        ['Overview', '概览'],
        ['Projects', '项目'],
        ['Prompt', '提示词'],
        ['Property', '属性'],
        ['Rename', '重命名'],
        ['Response', '响应'],
        ['Source:', '来源：'],
        [' Theme ', '主题'],
        ['Added', '已添加'],
        ['Billing', '计费'],
        ['Confirm', '确认'],
        ['Default', '默认'],
        ['FAQ', '常见问题'],
        ['Latency', '延迟'],
        ['Objects', '物体'],
        ['Owner', '所有者'],
        ['Preview', '预览'],
        ['Project', '项目'],
        ['Related', '相关'],
        ['Warning', '警告'],
        [' file ', '文件'],
        ['Animal', '动物'],
        ['Cancel', '取消'],
        ['Coding', '编码'],
        ['Delete', '删除'],
        ['Filter', '筛选'],
        ['Flower', '花朵'],
        ['Nature', '自然'],
        ['Output', '输出'],
        ['Search', '搜索'],
        ['Speech', '语音'],
        ['Videos', '视频'],
        ['Build', '构建'],
        ['Close', '关闭'],
        ['Files', '文件'],
        ['Input', '输入'],
        ['Model', '模型'],
        ['Paste', '粘贴'],
        ['Photo', '照片'],
        ['Reset', '重置'],
        ['Share', '分享'],
        ['Space', '太空'],
        ['Terms', '条款'],
        ['Today', '今天'],
        ['Tools', '工具'],
        ['Usage', '使用'],
        ['Video', '视频'],
        ['Voice', '语音'],
        ['Auto', '自动'],
        ['Chat', '聊天'],
        ['Code', '代码'],
        ['Copy', '复制'],
        ['Edit', '编辑'],
        ['Food', '食物'],
        ['Free', '免费'],
        ['Live', '实时'],
        ['Medium', '中'],
        ['Mode', '模式'],
        ['Move', '移动'],
        ['Name', '名称'],
        ['Peek', '速览'],
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
        ['OK', '确定'],
        ['and', '和'],
        ['Low', '低'],
        ['New', '新'],
        ['NEW', '新'],
        ['me', '我'],
        ['s ', '秒'],
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
        ['Restored from', '從...復原：'],
        [' Running for ', '執行時間 '],
        ['Image Editing', '圖像編輯'],
        ['Save app', '儲存應用程式'],
        ['Thinking...', '思考中...'],
        ['Saving…..', '儲存中...'],
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
        ['Restored from', '從...復原：'],
        [' Running for ', '執行時間 '],
        ['Image Editing', '圖片編輯'],
        ['Save app', '儲存應用程式'],
        ['Thinking...', '思考中...'],
        ['Saving…..', '儲存中...'],
        ['Added', '已新增'],
        ['User', '使用者'],
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
        console.log(`[汉化脚本-PERF] ${operation} 耗时: ${duration.toFixed(2)}ms`, ...args);
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
        /* 当 <html> 标签有 'translation-in-progress' 类时，隐藏 <body> */
        html.translation-in-progress body {
            visibility: hidden !important;
            opacity: 0 !important;
        }
        /* 当翻译完成后，此类被添加，使 <body> 平滑地淡入显示 */
        html.translation-complete body {
            visibility: visible !important;
            opacity: 1 !important;
            transition: opacity 0.1s ease-in !important;
        }
        /*
         * 一个重要的例外：即使在隐藏 body 时，也要保持常见的加载指示器 (spinner/loader) 可见。
         * 这可以避免让用户误以为页面卡死或未加载，提升了等待期间的体验。
         */
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
  var BLOCKS_CONTENT_ONLY = /* @__PURE__ */ new Set([]);
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
      if (blockedElements.has(tagName)) return true;
      if (element.classList) {
        for (const className of element.classList) {
          if (BLOCKED_CSS_CLASSES.has(className)) return true;
        }
      }
      for (const selector of blockedElementSelectors) {
        if (element.matches?.(selector)) return true;
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
      if (!element || isElementBlocked(element) || element.isContentEditable) return false;
      if (element.childElementCount > 0) return false;
      if (element.querySelector(Array.from(blockedElements).join(','))) return false;
      const fullText = element.textContent?.trim();
      if (!fullText) return false;
      const translation = textTranslationMap.get(fullText);
      if (!translation) return false;
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      if (textNodes.length === 0) return false;
      textNodes[0].nodeValue = translation;
      for (let i = 1; i < textNodes.length; i++) {
        textNodes[i].nodeValue = '';
      }
      log('整段翻译:', `"${fullText}"`, '->', `"${translation}"`);
      return true;
    }
    function translateElement(element) {
      if (!element || translatedElements.has(element) || !(element instanceof Element || element instanceof ShadowRoot)) return;
      const tagName = element.tagName?.toLowerCase();
      if (isElementBlocked(element) || element.isContentEditable) {
        translatedElements.add(element);
        return;
      }
      const isContentBlocked = BLOCKS_CONTENT_ONLY.has(tagName);
      if (!isContentBlocked) {
        if (translateElementContent(element)) {
          translatedElements.add(element);
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
          nodesToTranslate.forEach((textNode) => {
            const originalText = textNode.nodeValue;
            const translatedText = translateText(originalText);
            if (originalText !== translatedText) {
              textNode.nodeValue = translatedText;
            }
          });
        }
      }
      const elementsWithAttributes = element.matches(`[${attributesToTranslate.join('], [')}]`) ? [element, ...element.querySelectorAll(`[${attributesToTranslate.join('], [')}]`)] : [...element.querySelectorAll(`[${attributesToTranslate.join('], [')}]`)];
      if (elementsWithAttributes.length > 0) {
        elementsWithAttributes.forEach((el) => {
          if (isElementBlocked(el)) return;
          attributesToTranslate.forEach((attr) => {
            if (el.hasAttribute(attr)) {
              const originalValue = el.getAttribute(attr);
              const translatedValue = translateText(originalValue);
              if (originalValue !== translatedValue) {
                el.setAttribute(attr, translatedValue);
                translateLog(`属性[${attr}]`, originalValue, translatedValue);
              }
            }
          });
        });
      }
      if (element.shadowRoot) {
        translateElement(element.shadowRoot);
      }
      translatedElements.add(element);
    }
    return {
      translate: translateElement,
      resetState: () => {
        translationCache.clear();
        translatedElements = /* @__PURE__ */ new WeakSet();
        log('翻译器状态已重置');
      },
      // 允许外部模块（如 observers.js）在 DOM 变动时，精确地使单个元素的缓存失效。
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
      for (const mutation of mutations) {
        let target = null;
        if (mutation.type === 'childList') {
          target = mutation.target;
        } else if (mutation.type === 'attributes') {
          target = mutation.target;
        } else if (mutation.type === 'characterData') {
          target = mutation.target.parentElement;
        }
        if (target instanceof Element) dirtyRoots.add(target);
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
      // 监听子节点的添加或删除
      subtree: true,
      // 监听以 document.body 为根的所有后代节点
      attributes: true,
      // 监听属性变化
      attributeFilter: ['placeholder', 'title', 'aria-label', 'alt', 'mattooltip'],
      // 只关心这些可能包含文本的属性
      characterData: true,
      // 监听文本节点的内容变化
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
      if (overrideLang && SUPPORTED_LANGUAGE_CODES.includes(overrideLang)) return overrideLang;
      const storedLang = localStorage.getItem('web-translate-language');
      if (storedLang && SUPPORTED_LANGUAGE_CODES.includes(storedLang)) return storedLang;
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang) {
        const lowerBrowserLang = browserLang.toLowerCase();
        if (SUPPORTED_LANGUAGE_CODES.includes(lowerBrowserLang)) return lowerBrowserLang;
        const partialMatch = SUPPORTED_LANGUAGE_CODES.find((code) => lowerBrowserLang.startsWith(code));
        if (partialMatch) return partialMatch;
      }
      return 'zh-cn';
    }
    async function fetchWithFallbacks(urls) {
      for (const url of urls) {
        try {
          const startTime = performance.now();
          const content = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: 'GET',
              url,
              onload: (response) => {
                const duration = performance.now() - startTime;
                if (response.status >= 200 && response.status < 300) {
                  log(`从 ${url} 成功加载内容，状态码: ${response.status}，耗时: ${duration.toFixed(2)}ms`);
                  resolve(response.responseText);
                } else {
                  log(`从 ${url} 请求失败，状态码: ${response.status}，耗时: ${duration.toFixed(2)}ms`, 'error');
                  reject(new Error(`请求失败，状态码: ${response.status}`));
                }
              },
              onerror: (error) => {
                const duration = performance.now() - startTime;
                log(`从 ${url} 网络请求出错: ${error.statusText}，耗时: ${duration.toFixed(2)}ms`, 'error');
                reject(new Error(`网络请求出错: ${error.statusText}`));
              },
              ontimeout: () => {
                const duration = performance.now() - startTime;
                log(`从 ${url} 请求超时，耗时: ${duration.toFixed(2)}ms`, 'error');
                reject(new Error('请求超时'));
              },
            });
          });
          return { content, sourceUrl: url };
        } catch (error) {
          log(`从 ${url} 加载失败: ${error.message}`, 'error');
        }
      }
      return { content: null, sourceUrl: null };
    }
    async function loadTranslationScript(hostname2, userLang2) {
      const repoUser = 'qing90bing';
      const repoName = 'qing_web-translate-script';
      const cacheBuster = `?v=${/* @__PURE__ */ new Date().getTime()}`;
      const cdnUrls = [`https://raw.githubusercontent.com/${repoUser}/${repoName}/main/src/translations/${userLang2}/${hostname2}.js`, `https://cdn.jsdelivr.net/gh/${repoUser}/${repoName}@latest/src/translations/${userLang2}/${hostname2}.js${cacheBuster}`];
      log(`正在尝试从 CDN 加载翻译文件: ${hostname2}.js for ${userLang2}...`);
      const result = await fetchWithFallbacks(cdnUrls);
      if (!result.content) {
        log(`无法从所有 CDN 源获取翻译文件: ${hostname2}.js`, 'error');
        return null;
      }
      log(`成功从 ${result.sourceUrl} 获取到翻译文件内容`);
      let blobUrl = '';
      try {
        const blob = new Blob([result.content], { type: 'text/javascript' });
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
      if (EMBEDDED_TRANSLATIONS[userLang]?.[hostname]) {
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
