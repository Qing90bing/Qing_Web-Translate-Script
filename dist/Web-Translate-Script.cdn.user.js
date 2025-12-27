// ==UserScript==
// @name         WEB 中文汉化插件 - CDN
// @name:en-US   WEB Chinese Translation Plugin - CDN
// @namespace    https://github.com/Qing90bing/Qing_Web-Translate-Script
// @version      1.0.115-2025-12-28-cdn
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
// @match        *://status.claude.com/*
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
// ==/UserScript==

const EMBEDDED_TRANSLATIONS = {};

const EMBEDDED_SITES = ['aistudio.google.com', 'gemini.google.com'];

(() => {
  // src/config/languages.js
  var SUPPORTED_LANGUAGES = [
    { code: 'zh-cn', name: '简体中文', flag: '🇨🇳' },
    { code: 'zh-tw', name: '繁體中文', flag: '🇹🇼' },
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
    if (!document.documentElement) {
      return;
    }
    if (document.getElementById(STYLE_ID)) {
      return;
    }
    document.documentElement.classList.add('translation-in-progress');
    const antiFlickerStyle = document.createElement('style');
    antiFlickerStyle.id = STYLE_ID;
    const styleContent = 'html.translation-in-progress body{visibility:hidden!important;opacity:0!important}html.translation-complete body{visibility:visible!important;opacity:1!important;transition:opacity .1s ease-in!important}html.translation-in-progress [class*="load"],html.translation-in-progress [class*="spin"],html.translation-in-progress [id*="load"],html.translation-in-progress [id*="spin"],html.translation-in-progress .loader,html.translation-in-progress .spinner,html.translation-in-progress .loading{visibility:visible!important;opacity:1!important}';
    antiFlickerStyle.appendChild(document.createTextNode(styleContent));
    const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    head.insertBefore(antiFlickerStyle, head.firstChild);
  }
  function removeAntiFlickerStyle() {
    if (!document.documentElement) {
      return;
    }
    document.documentElement.classList.remove('translation-in-progress');
    document.documentElement.classList.add('translation-complete');
    setTimeout(() => {
      const styleElement = document.getElementById(STYLE_ID);
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    }, 100);
  }

  // src/config/index.js
  var BLOCKS_ALL_TRANSLATION = /* @__PURE__ */ new Set(['script', 'style', 'pre', 'code', 'svg']);
  var BLOCKS_CONTENT_ONLY = /* @__PURE__ */ new Set([]);
  var ALL_UNTRANSLATABLE_TAGS = /* @__PURE__ */ new Set([...BLOCKS_ALL_TRANSLATION, ...BLOCKS_CONTENT_ONLY]);
  var attributesToTranslate = ['placeholder', 'title', 'aria-label', 'alt', 'mattooltip', 'label'];
  var BLOCKED_CSS_CLASSES = /* @__PURE__ */ new Set(['notranslate', 'kbd']);

  // src/modules/core/translator.js
  function createTranslator(textRules, regexArr, blockedSelectors = [], extendedSelectors = [], customAttributes = [], blockedAttributes = [], pseudoRules = []) {
    let shadowRootFoundCallback = null;
    const textTranslationMap = /* @__PURE__ */ new Map();
    if (Array.isArray(textRules)) {
      for (const rule of textRules) {
        if (Array.isArray(rule) && rule.length === 2 && typeof rule[0] === 'string' && typeof rule[1] === 'string') {
          textTranslationMap.set(rule[0].trim(), rule[1]);
        }
      }
    }
    let regexRules = regexArr;
    let translationCache = /* @__PURE__ */ new Map();
    let translatedElements = /* @__PURE__ */ new WeakSet();
    const blockedElements = /* @__PURE__ */ new Set([...ALL_UNTRANSLATABLE_TAGS]);
    const blockedElementSelectors = blockedSelectors || [];
    const whitelist = /* @__PURE__ */ new Set([...attributesToTranslate, ...customAttributes]);
    for (const attr of blockedAttributes) {
      whitelist.delete(attr);
    }
    const finalAttributesToTranslate = whitelist;
    function isInsideExtendedElement(element) {
      if (!element || extendedSelectors.length === 0) return false;
      for (const selector of extendedSelectors) {
        if (element.closest(selector)) {
          return true;
        }
      }
      return false;
    }
    const MASK_NO_TRANSLATE = 1;
    const MASK_CONTENT_ONLY = 2;
    const TAG_FLAGS = {};
    BLOCKS_ALL_TRANSLATION.forEach((tag) => {
      TAG_FLAGS[tag.toUpperCase()] = MASK_NO_TRANSLATE;
      TAG_FLAGS[tag.toLowerCase()] = MASK_NO_TRANSLATE;
    });
    BLOCKS_CONTENT_ONLY.forEach((tag) => {
      const upperTag = tag.toUpperCase();
      const lowerTag = tag.toLowerCase();
      const mergeFlag = (key, mask) => {
        if ((TAG_FLAGS[key] & MASK_NO_TRANSLATE) !== MASK_NO_TRANSLATE) {
          TAG_FLAGS[key] = (TAG_FLAGS[key] || 0) | mask;
        }
      };
      mergeFlag(upperTag, MASK_CONTENT_ONLY);
      mergeFlag(lowerTag, MASK_CONTENT_ONLY);
    });
    function isElementBlocked(element) {
      if (!(element instanceof Element)) return false;
      const tagName = element.tagName;
      const flags = TAG_FLAGS[tagName];
      if (flags & MASK_NO_TRANSLATE) return true;
      if (element.isContentEditable) return true;
      if (element.classList && element.classList.length > 0) {
        for (const className of element.classList) {
          if (BLOCKED_CSS_CLASSES.has(className)) return true;
        }
      }
      if (blockedElementSelectors.length > 0) {
        for (const selector of blockedElementSelectors) {
          if (element.matches(selector)) return true;
        }
      }
      return false;
    }
    function isInsideBlockedElement(element) {
      let current = element;
      while (current) {
        if (isElementBlocked(current)) {
          return true;
        }
        const root = current.getRootNode();
        if (root instanceof ShadowRoot) {
          current = root.host;
        } else {
          current = current.parentElement;
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
      if (translationCache.size > 5e3) {
        translationCache.clear();
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
      translationCache.set(originalText, translatedText);
      return translatedText;
    }
    function translateElementContent(element) {
      if (!element || isInsideBlockedElement(element)) return false;
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
    function translatePseudoElements(element) {
      if (!element || !element.tagName) return;
      const handleType = (type) => {
        try {
          const pseudoStyle = window.getComputedStyle(element, `::${type}`);
          const content = pseudoStyle.getPropertyValue('content');
          if (content && content !== 'none' && content !== 'normal') {
            const cleanContent = content.replace(/^['"]|['"]$/g, '');
            if (cleanContent.trim()) {
              const translated = translateText(cleanContent);
              if (translated !== cleanContent) {
                const attrName = `data-wts-${type}`;
                if (element.getAttribute(attrName) !== translated) {
                  element.setAttribute(attrName, translated);
                  translateLog(`通用伪元素[::${type}]`, cleanContent, translated);
                }
              }
            }
          }
        } catch (e) {}
      };
      handleType('before');
      handleType('after');
    }
    function translateElement(element) {
      if (!element || translatedElements.has(element) || !(element instanceof Element || element instanceof ShadowRoot)) return;
      if (element instanceof ShadowRoot && shadowRootFoundCallback) {
        shadowRootFoundCallback(element);
      }
      if (isInsideBlockedElement(element)) {
        translatedElements.add(element);
        return;
      }
      const tagName = element.tagName;
      const flags = TAG_FLAGS[tagName] || 0;
      const isContentBlocked = (flags & MASK_CONTENT_ONLY) !== 0;
      if (!isContentBlocked) {
        if (translateElementContent(element)) {
          if (element instanceof Element && pseudoRules.length > 0) {
            for (const rule of pseudoRules) {
              if (element.matches(rule.selector)) {
                translatePseudoElements(element);
                break;
              }
            }
          }
          translatedElements.add(element);
          return;
        }
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
          acceptNode: function (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (isElementBlocked(node)) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
            if (node.nodeType === Node.TEXT_NODE) {
              if (!node.nodeValue?.trim()) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
          },
        });
        if (element instanceof Element && !isElementBlocked(element)) {
          translateAttributes(element);
          if (pseudoRules.length > 0) {
            for (const rule of pseudoRules) {
              if (element.matches(rule.selector)) {
                translatePseudoElements(element);
                break;
              }
            }
          }
        }
        while (walker.nextNode()) {
          const node = walker.currentNode;
          if (node.nodeType === Node.TEXT_NODE) {
            const originalText = node.nodeValue;
            const translatedText = translateText(originalText);
            if (originalText !== translatedText) {
              node.nodeValue = translatedText;
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            translateAttributes(node);
            if (pseudoRules.length > 0) {
              for (const rule of pseudoRules) {
                if (node.matches(rule.selector)) {
                  translatePseudoElements(node);
                  break;
                }
              }
            }
            if (node.shadowRoot) {
              if (shadowRootFoundCallback) shadowRootFoundCallback(node.shadowRoot);
              translateElement(node.shadowRoot);
            }
          }
        }
      } else {
        if (element instanceof Element) translateAttributes(element);
      }
      function translateAttributes(el) {
        if (!el.hasAttributes()) return;
        for (const attr of el.attributes) {
          const attrName = attr.name;
          const originalValue = attr.value;
          if (!originalValue || !originalValue.trim()) continue;
          if (blockedAttributes.includes(attrName)) {
            continue;
          }
          if (finalAttributesToTranslate.has(attrName)) {
            const translatedValue = translateText(originalValue);
            if (originalValue !== translatedValue) {
              el.setAttribute(attrName, translatedValue);
              translateLog(`白名单属性[${attrName}]`, originalValue, translatedValue);
            }
          } else if (isInsideExtendedElement(el)) {
            const trimmedValue = originalValue.trim();
            if (textTranslationMap.has(trimmedValue)) {
              const translated = textTranslationMap.get(trimmedValue);
              const leadingSpace = originalValue.match(/^\s*/)[0] || '';
              const trailingSpace = originalValue.match(/\s*$/)[0] || '';
              const translatedValue = leadingSpace + translated + trailingSpace;
              if (originalValue !== translatedValue) {
                el.setAttribute(attrName, translatedValue);
                translateLog(`扩展区属性[${attrName}]`, originalValue, translatedValue);
              }
            }
          }
        }
      }
      if (element.shadowRoot) {
        if (shadowRootFoundCallback) shadowRootFoundCallback(element.shadowRoot);
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
      translatePseudoElements,
      // 暴露给外部使用
      // 允许外部注册 Shadow Root 发现回调
      setShadowRootCallback: (callback) => {
        shadowRootFoundCallback = callback;
      },
    };
  }

  // src/modules/core/observers.js
  function initializeObservers(translator, extendedElements = [], customAttributes = [], blockedAttributes = []) {
    const translationQueue = /* @__PURE__ */ new Set();
    let isScheduled = false;
    const FRAME_BUDGET = 12;
    function processQueue() {
      const frameStart = performance.now();
      let tasksProcessed = 0;
      const processSet = (queue, processor) => {
        if (queue.size === 0) return true;
        const iterator = queue[Symbol.iterator]();
        let result = iterator.next();
        while (!result.done) {
          if (performance.now() - frameStart > FRAME_BUDGET) {
            return false;
          }
          const item = result.value;
          queue.delete(item);
          processor(item);
          result = iterator.next();
        }
        return true;
      };
      const translationProcessor = (node) => {
        if (!node.isConnected) return;
        if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          translator.translate(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
          translator.translate(node.parentElement);
        }
        tasksProcessed++;
      };
      if (!processSet(translationQueue, translationProcessor)) {
        requestAnimationFrame(processQueue);
        return;
      }
      isScheduled = false;
    }
    function scheduleProcessing() {
      if (!isScheduled) {
        isScheduled = true;
        requestAnimationFrame(processQueue);
      }
    }
    const mutationHandler = (mutations) => {
      let hasUpdates = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              translationQueue.add(node);
              translator.deleteElement(node);
              hasUpdates = true;
            } else if (node.nodeType === Node.TEXT_NODE) {
              if (node.parentElement) {
                translationQueue.add(node.parentElement);
                translator.deleteElement(node.parentElement);
                hasUpdates = true;
              }
            }
          });
        } else if (mutation.type === 'attributes') {
          const target = mutation.target;
          translationQueue.add(target);
          translator.deleteElement(target);
          hasUpdates = true;
        } else if (mutation.type === 'characterData') {
          const target = mutation.target.parentElement;
          if (target) {
            translationQueue.add(target);
            translator.deleteElement(target);
            hasUpdates = true;
          }
        }
      }
      if (hasUpdates) {
        scheduleProcessing();
      }
    };
    const mainObserver = new MutationObserver(mutationHandler);
    const observedShadowRoots = /* @__PURE__ */ new WeakSet();
    function observeRoot(root) {
      if (!root || observedShadowRoots.has(root)) {
        return;
      }
      const observer = new MutationObserver(mutationHandler);
      observer.observe(root, observerConfig);
      observedShadowRoots.add(root);
    }
    let currentUrl = window.location.href;
    const pageObserver = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        log('检测到页面导航，将重新翻译:', currentUrl);
        translator.resetState();
        setTimeout(() => {
          log('开始重新翻译新页面内容...');
          if (document.body) {
            translationQueue.add(document.body);
            scheduleProcessing();
          }
        }, 300);
      }
    });
    const whitelist = /* @__PURE__ */ new Set([...attributesToTranslate, ...customAttributes]);
    for (const attr of blockedAttributes) {
      whitelist.delete(attr);
    }
    const finalAttributeFilter = [...whitelist];
    const observerConfig = {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: finalAttributeFilter,
      characterData: true,
    };
    if (translator.setShadowRootCallback) {
      translator.setShadowRootCallback((shadowRoot) => {
        observeRoot(shadowRoot);
      });
    }
    function patchAttachShadow(win, winName) {
      try {
        if (!win || !win.Element || !win.Element.prototype || !win.Element.prototype.attachShadow) {
          return false;
        }
        const originalAttachShadow = win.Element.prototype.attachShadow;
        if (originalAttachShadow._isPatchedByWTS) {
          return true;
        }
        const patchedAttachShadow = function (init) {
          const shadowRoot = originalAttachShadow.call(this, init);
          try {
            if (shadowRoot) {
              observeRoot(shadowRoot);
            }
          } catch (e) {}
          return shadowRoot;
        };
        patchedAttachShadow._isPatchedByWTS = true;
        try {
          win.Element.prototype.attachShadow = patchedAttachShadow;
        } catch (err) {
          try {
            Object.defineProperty(win.Element.prototype, 'attachShadow', {
              value: patchedAttachShadow,
              writable: true,
              configurable: true,
            });
          } catch (err2) {
            throw new Error(`Assignment failed: ${err.message}, DefineProperty failed: ${err2.message}`);
          }
        }
        if (win.Element.prototype.attachShadow !== patchedAttachShadow) {
          throw new Error('Patch 写入后未生效 (可能被重置或被 Proxy 拦截)');
        }
        log(`[${winName}] 已成功拦截 Element.prototype.attachShadow`);
        return true;
      } catch (e) {
        debug(`[${winName}] 拦截 attachShadow 失败:`, e.message);
        return false;
      }
    }
    const resultWindow = patchAttachShadow(window, 'window');
    let resultUnsafe = false;
    if (typeof unsafeWindow !== 'undefined' && unsafeWindow !== window) {
      resultUnsafe = patchAttachShadow(unsafeWindow, 'unsafeWindow');
    }
    if (!resultWindow && !resultUnsafe) {
      log('警告: 无法在任何环境中拦截 attachShadow。动态 Shadow DOM 翻译可能会失效。这通常是由于网站严格的 CSP 或安全策略导致。');
    }
    observeRoot(document.body);
    const initWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (n) => (n.shadowRoot ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
    });
    while (initWalker.nextNode()) {
      observeRoot(initWalker.currentNode.shadowRoot);
    }
    pageObserver.observe(document.body, { childList: true, subtree: true });
    let titleObserver = null;
    const handleTitleContentChange = () => {
      const titleElement = document.querySelector('title');
      if (titleElement) {
        translator.deleteElement(titleElement);
        translator.translate(titleElement);
      }
    };
    const attachTitleObserver = (element) => {
      if (!element) return;
      if (titleObserver) {
        titleObserver.disconnect();
      }
      titleObserver = new MutationObserver(handleTitleContentChange);
      titleObserver.observe(element, {
        childList: true,
        subtree: true,
        characterData: true,
        // 有些浏览器直接改 textNode
      });
      translator.deleteElement(element);
      translator.translate(element);
    };
    const headObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeName === 'TITLE') {
              attachTitleObserver(node);
            }
          }
        }
      }
    });
    const headElement = document.head || document.querySelector('head');
    if (headElement) {
      headObserver.observe(headElement, { childList: true });
    }
    const currentTitle = document.querySelector('title');
    if (currentTitle) {
      attachTitleObserver(currentTitle);
    }
    window.forceRetranslate = function () {
      log('强制重新翻译已触发。');
      translator.resetState();
      if (document.body) {
        translationQueue.add(document.body);
        scheduleProcessing();
      }
    };
    if (extendedElements.length > 0) {
      const extendedMutationHandler = (mutations) => {
        let hasUpdates = false;
        for (const mutation of mutations) {
          let target;
          if (mutation.type === 'characterData') {
            target = mutation.target.parentElement;
          } else if (mutation.type === 'attributes') {
            target = mutation.target;
          }
          if (target instanceof Element) {
            translator.deleteElement(target);
            translationQueue.add(target);
            hasUpdates = true;
          }
        }
        if (hasUpdates) scheduleProcessing();
      };
      const extendedContentObserver = new MutationObserver(extendedMutationHandler);
      const extendedAttributeObserver = new MutationObserver(extendedMutationHandler);
      log(`正在为 ${extendedElements.length} 个选择器初始化扩展元素监控。`);
      const processExtendedElements = (elements) => {
        if (elements.length === 0) return;
        elements.forEach((element) => {
          translator.deleteElement(element);
          translationQueue.add(element);
          extendedContentObserver.observe(element, { characterData: true, subtree: true });
          extendedAttributeObserver.observe(element, { attributes: true, subtree: true });
        });
        scheduleProcessing();
      };
      extendedElements.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            processExtendedElements(Array.from(elements));
          }
        } catch (e) {
          console.error(`extendedElements 中的选择器无效: "${selector}"`, e);
        }
      });
      const additionObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (const addedNode of mutation.addedNodes) {
              if (addedNode.nodeType === Node.ELEMENT_NODE) {
                extendedElements.forEach((selector) => {
                  const matchedElements = [];
                  if (addedNode.matches(selector)) matchedElements.push(addedNode);
                  addedNode.querySelectorAll(selector).forEach((el) => matchedElements.push(el));
                  if (matchedElements.length > 0) {
                    processExtendedElements(matchedElements);
                  }
                });
              }
            }
          }
        }
      });
      additionObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
      log('扩展元素观察器已激活。');
    }
    log('监听器初始化完成 (Time Slicing Enabled)。');
  }

  // src/modules/core/translationInitializer.js
  function initializeTranslation(siteDictionary, createTranslator2, removeAntiFlickerStyle2, initializeObservers2, log2) {
    const { language, styles: cssRules = [], blockedElements = [], extendedElements = [], customAttributes = [], blockedAttributes = [], jsRules = [], regexRules = [], textRules = [], pseudoElements = [] } = siteDictionary;
    log2(`开始初始化翻译流程，使用语言: ${language ?? 'unknown'}`);
    if (textRules && textRules.length > 0) {
      log2(`加载了 ${textRules.length} 条文本翻译规则`);
    }
    const parsedPseudoRules = [];
    if (pseudoElements && pseudoElements.length > 0) {
      for (const selector of pseudoElements) {
        const match = selector.match(/^(.*)(:{1,2})(before|after)$/);
        if (match) {
          const baseSelector = match[1].trim();
          const type = match[3];
          if (baseSelector) {
            parsedPseudoRules.push({ selector: baseSelector, type });
          }
        }
      }
    }
    const universalPseudoCss = [
      '[data-wts-before]::before { content: attr(data-wts-before) !important; }',
      '[data-wts-after]::after { content: attr(data-wts-after) !important; }',
      '@keyframes wts-pseudo-start { from { opacity: 0.99; } to { opacity: 1; } }',
      // 应用于所有伪元素。如果网站定义了自己的 animation，根据 CSS 优先级(Cascade)，
      // 网站的规则(通常带有类名)会覆盖这里(仅标签名)，从而避免冲突。
      '*::before, *::after { animation-duration: 0.001s; animation-name: wts-pseudo-start; }',
    ];
    const allCssRules = [...cssRules, ...universalPseudoCss];
    if (allCssRules.length > 0) {
      const customStyleElement = document.createElement('style');
      customStyleElement.id = 'web-translate-custom-styles';
      customStyleElement.appendChild(document.createTextNode(allCssRules.join('\n')));
      const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
      head.appendChild(customStyleElement);
      log2(`注入了 ${allCssRules.length} 条CSS样式 (含通用伪元素支持 & 动画检测)`);
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
    const translator = createTranslator2(textRules, regexRules, blockedElements, extendedElements, customAttributes, blockedAttributes, parsedPseudoRules);
    document.addEventListener(
      'animationstart',
      (event) => {
        if (event.animationName === 'wts-pseudo-start') {
          const target = event.target;
          if (target instanceof Element) {
            translator.translatePseudoElements(target);
          }
        }
      },
      { passive: true },
    );
    document.addEventListener(
      'mouseover',
      (event) => {
        const target = event.target;
        if (target instanceof Element) {
          setTimeout(() => {
            translator.translatePseudoElements(target);
            let parent = target.parentElement;
            let depth = 0;
            while (parent && depth < 2) {
              translator.translatePseudoElements(parent);
              parent = parent.parentElement;
              depth++;
            }
          }, 50);
        }
      },
      { passive: true },
    );
    log2('已激活通用伪元素自动翻译监听器 (Animation + Mouseover)');
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
    async function initializeFullTranslation() {
      log2('开始执行初次全文翻译...');
      const startTime = performance.now();
      await translator.translate(document.body);
      const titleElement = document.querySelector('title');
      if (titleElement) {
        translator.translate(titleElement);
      }
      const duration = performance.now() - startTime;
      log2(`初次翻译完成。使用语言: ${language || 'unknown'}, 耗时: ${duration.toFixed(2)}ms`);
      removeAntiFlickerStyle2();
      initializeObservers2(translator, extendedElements, customAttributes, blockedAttributes, document.querySelector('title'));
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
