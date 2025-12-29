// ==UserScript==
// @name         WEB 中文汉化插件 - CDN
// @name:en-US   WEB Chinese Translation Plugin - CDN
// @namespace    https://github.com/Qing90bing/Qing_Web-Translate-Script
// @version      1.0.120-2025-12-29-cdn
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

const EMBEDDED_TRANSLATIONS = {
  'zh-cn': {
    'aistudio.google.com': {
      language: 'zh-cn',
      enabled: true,
      styles: [],
      blockedElements: ['.view-line', '.very-large-text-container', '.name-btn'],
      extendedElements: [],
      customAttributes: [],
      blockedAttributes: ['ms-prompt-chunk'],
      jsRules: [],
      regexRules: [
        [/↩\s*Add a new line\s*\n\s*Alt\s*\+\s*↩\s*Append text without running\s*\n\s*Ctrl\s*\+\s*↩\s*Run prompt/i, '↩  换行\nAlt + ↩  追加文本 (不执行)\nCtrl + ↩  执行指令'],
        [/Invalid JSON: SyntaxError: Unexpected token '(.+?)', "(.+?)" is not valid JSON/i, '无效的 JSON 语法错误：在 “$2” 中存在意外的字符 “$1”'],
        [/([<>]=?)\s*(\d+K)\s+tokens\s+•\s+Input:\s+\$([\d.]+)\s+\/\s+Output:\s+\$([\d.]+)/i, '$1$2 Tokens | 输入: $$ $3 / 输出: $$ $4'],
        [/Image \(\*Output per image\) • Input: \$([\d.]+) \/ Output: \$([\d.]+)/i, '图像 (*每张图片输出) | 输入: $$ $1 / 输出: $$ $2'],
        [/All context lengths\s+•\s+Input:\s+\$([\d.]+)\s+\/\s+Output:\s+\$([\d.]+)/i, '所有上下文长度 | 输入: $$ $1 / 输出: $$ $2'],
        [/\s*Context\s+Caching\s+•\s+Input:\s+([\$\d\.]+)\s+\/\s+Output:\s+([\$\d\.]+)\s*/i, '上下文缓存 • 输入：$1 / 输出：$2'],
        [/\s*Audio\/Video\s+•\s+Input:\s+([\$\d\.]+)\s+\/\s+Output:\s+([\$\d\.]+)\s*/i, '音频/视频 • 输入：$1 / 输出：$2'],
        [/\s*Image\s+•\s+Input:\s+([\$\d\.]+)\s+\/\s+Output:\s+([\$\d\.]+)\s*/i, '图像 • 输入：$1 / 输出：$2'],
        [/\s*Text\s+•\s+Input:\s+([\$\d\.]+)\s+\/\s+Output:\s+([\$\d\.]+)\s*/i, '文本 • 输入：$1 / 输出：$2'],
        [/\s*Choose\s+a\s+paid\s+key\s+for\s+(.+?)\s+Dashboard\s+Replica\s*/i, '为 $1 仪表板副本选择付费密钥'],
        [/↩\s*Add a new line\s*\n\s*Ctrl\s*\+\s*↩\s*Run prompt/i, '↩  换行\nCtrl + ↩  执行指令'],
        [/Text • Input: \$([\d.]+) \/ Output: \$([\d.]+)/i, '文本 | 输入：$$ $1，输出：$ $2'],
        [/\s*Automatic\s+snapshot\s+\((\d+)\s+minutes?\s+ago\)\s*/i, '自动快照 ($1 分钟前)'],
        [/Last modified:\s*(\d{4})\/(\d{1,2})\/(\d{1,2})/, '最后修改于：$1 年 $2 月 $3 日'],
        [/\s*Automatic\s+snapshot\s+\((\d+)\s+hours?\s+ago\)\s*/i, '自动快照 ($1 小时前)'],
        [/\s*Automatic\s+snapshot\s+\((\d+)\s+seconds?\s+ago\)\s*/i, '自动快照 ($1 秒前)'],
        [/\s*Knowledge\s+cut\s*off:\s+(\d+)月\s+(\d{4})\s*/i, '知识截止日期：$2 年 $1 月'],
        [/\s*Automatic\s+snapshot\s+\((\d+)\s+weeks?\s+ago\)\s*/i, '自动快照 ($1 周前)'],
        [/\s*Automatic\s+snapshot\s+\((\d+)\s+days?\s+ago\)\s*/i, '自动快照 ($1 天前)'],
        [/\s*Loaded\s+app\s+\((\d+)\s+minutes?\s+ago\)\s*/i, '已加载应用 ($1 分钟前)'],
        [/\s*Knowledge\s+cut\s+off:\s+Dec\s+(\d{4})\s*/, '知识截止日期：$1 年 12 月'],
        [/\s*Knowledge\s+cut\s+off:\s+Nov\s+(\d{4})\s*/, '知识截止日期：$1 年 11 月'],
        [/\s*Knowledge\s+cut\s+off:\s+Oct\s+(\d{4})\s*/, '知识截止日期：$1 年 10 月'],
        [/\s*Knowledge\s+cut\s+off:\s+Apr\s+(\d{4})\s*/, '知识截止日期：$1 年 4 月'],
        [/\s*Knowledge\s+cut\s+off:\s+Aug\s+(\d{4})\s*/, '知识截止日期：$1 年 8 月'],
        [/\s*Knowledge\s+cut\s+off:\s+Feb\s+(\d{4})\s*/, '知识截止日期：$1 年 2 月'],
        [/\s*Knowledge\s+cut\s+off:\s+Jan\s+(\d{4})\s*/, '知识截止日期：$1 年 1 月'],
        [/\s*Knowledge\s+cut\s+off:\s+Jul\s+(\d{4})\s*/, '知识截止日期：$1 年 7 月'],
        [/\s*Knowledge\s+cut\s+off:\s+Jun\s+(\d{4})\s*/, '知识截止日期：$1 年 6 月'],
        [/\s*Knowledge\s+cut\s+off:\s+Mar\s+(\d{4})\s*/, '知识截止日期：$1 年 3 月'],
        [/\s*Knowledge\s+cut\s+off:\s+May\s+(\d{4})\s*/, '知识截止日期：$1 年 5 月'],
        [/\s*Knowledge\s+cut\s+off:\s+Sep\s+(\d{4})\s*/, '知识截止日期：$1 年 9 月'],
        [/\s*Loaded\s+app\s+\((\d+)\s+hours?\s+ago\)\s*/i, '已加载应用 ($1 小时前)'],
        [/\s*Loaded\s+app\s+\((\d+)\s+seconds?\s+ago\)\s*/i, '已加载应用 ($1 秒前)'],
        [/^\s*(\d+)\s+[–-]\s+(\d+)\s+of\s+(\d+)\s*$/i, '第 $1 - $2 项 / 共 $3 项'],
        [/^Copied\s+models\/(.+)\s+to\s+clipboard$/i, '已将模型“$1”复制到剪贴板'],
        [/\s*Code\s+assistant\s+changes\s+for:\s+(.+)/i, '代码助手更改：$1'],
        [/^Copied\s+(.+)\s+to\s+clipboard$/i, '已将模型“$1”复制到剪贴板'],
        [/\s*Dec\s+(\d{1,2}),\s*(\d{2}:\d{2})\s*/, '12 月 $1 日 $2'],
        [/\s*Nov\s+(\d{1,2}),\s*(\d{2}:\d{2})\s*/, '11 月 $1 日 $2'],
        [/\s*Oct\s+(\d{1,2}),\s*(\d{2}:\d{2})\s*/, '10 月 $1 日 $2'],
        [/\s*Apr\s+(\d{1,2}),\s*(\d{2}:\d{2})\s*/, '4 月 $1 日 $2'],
        [/\s*Aug\s+(\d{1,2}),\s*(\d{2}:\d{2})\s*/, '8 月 $1 日 $2'],
        [/\s*Feb\s+(\d{1,2}),\s*(\d{2}:\d{2})\s*/, '2 月 $1 日 $2'],
        [/\s*Jan\s+(\d{1,2}),\s*(\d{2}:\d{2})\s*/, '1 月 $1 日 $2'],
        [/\s*Jul\s+(\d{1,2}),\s*(\d{2}:\d{2})\s*/, '7 月 $1 日 $2'],
        [/\s*Jun\s+(\d{1,2}),\s*(\d{2}:\d{2})\s*/, '6 月 $1 日 $2'],
        [/\s*Mar\s+(\d{1,2}),\s*(\d{2}:\d{2})\s*/, '3 月 $1 日 $2'],
        [/\s*May\s+(\d{1,2}),\s*(\d{2}:\d{2})\s*/, '5 月 $1 日 $2'],
        [/\s*Sep\s+(\d{1,2}),\s*(\d{2}:\d{2})\s*/, '9 月 $1 日 $2'],
        [/Analyzed errors for (\d+) seconds/, '分析了 $1 秒的错误'],
        [/\s*(\d+)\s+projects?\s+selected\s*/, '已选 $1 个项目'],
        [/Ran command\s+[“"]([\s\S]*?)[”"]/i, '运行命令：$1'],
        [/^\s*Move\s+([\w./-]+)\s+to\s*$/i, '移动文件：$1 到'],
        [/\s*(\d+)\s+logs?\s+selected\s*/, '已选 $1 个日志'],
        [/Dec\s+(\d{1,2}),\s+(\d{4})/, '$2 年 12 月 $1 日'],
        [/Nov\s+(\d{1,2}),\s+(\d{4})/, '$2 年 11 月 $1 日'],
        [/Oct\s+(\d{1,2}),\s+(\d{4})/, '$2 年 10 月 $1 日'],
        [/\s*(\d+)\s+of\s+(\d+)\s*/, '共 $2 个，第 $1 个'],
        [/Apr\s+(\d{1,2}),\s+(\d{4})/, '$2 年 4 月 $1 日'],
        [/Aug\s+(\d{1,2}),\s+(\d{4})/, '$2 年 8 月 $1 日'],
        [/Feb\s+(\d{1,2}),\s+(\d{4})/, '$2 年 2 月 $1 日'],
        [/Jan\s+(\d{1,2}),\s+(\d{4})/, '$2 年 1 月 $1 日'],
        [/Jul\s+(\d{1,2}),\s+(\d{4})/, '$2 年 7 月 $1 日'],
        [/Jun\s+(\d{1,2}),\s+(\d{4})/, '$2 年 6 月 $1 日'],
        [/Mar\s+(\d{1,2}),\s+(\d{4})/, '$2 年 3 月 $1 日'],
        [/May\s+(\d{1,2}),\s+(\d{4})/, '$2 年 5 月 $1 日'],
        [/Sep\s+(\d{1,2}),\s+(\d{4})/, '$2 年 9 月 $1 日'],
        [/^\s*Manual\s*:\s*(\d+)\s*$/i, ' 思考预算：$1 '],
        [/(\d+) tokens \/ image/, '$1 Tokens / 图像'],
        [/\/\s+(\d+)\s+generations?/i, '/ $1 次生成'],
        [/Thought for (\d+) seconds/, '思考了 $1 秒'],
        [/Move\s+([\w\.-]+)\s+to/i, '将 $1 移动到'],
        [/^Running (\d+(\.\d+)?)s$/, '运行 $1 秒'],
        [/^\s*(-?\d+(\.\d+)?)\s*s\s*$/i, '$1 秒'],
        [/^Branch of\s+(.+)$/i, '分支于：“$1”'],
        [/Edit\s+([\w-]+\.[\w.-]+)/i, '编辑 $1'],
        [/(\d+)\s*minutes?\s*ago/, '$1 分钟前'],
        [/(\d+)h\s+(\d+)m/i, '$1 小时 $2 分钟'],
        [/(\d+)\s*months?\s*ago/, '$1 个月前'],
        [/(\d+)\s*hours?\s*ago/, '$1 小时前'],
        [/(\d+)\s*seconds?\s*ago/, '$1 秒前'],
        [/([\d,]+)\s*tokens/i, '$1 Tokens'],
        [/(\d+)\s*weeks?\s*ago/, '$1 周前'],
        [/(\d+)\s*years?\s*ago/, '$1 年前'],
        [/^Selected\s+(.+)$/i, '已选择 $1'],
        [/(\d+)\s*days?\s*ago/, '$1 天前'],
        [/\b(\d+)\s+keys?\b/, '$1 个密钥'],
        [/Share\s+"(.+?)"/i, '分享“$1”'],
        [/^Deleted\s+(.+)$/i, '已删除$1'],
        [/(^|\s)(\d+)m\b/g, '$1$2 分钟'],
        [/^(\d+)\s+months?$/i, '$1 月'],
        [/^Delete\s+(.+)$/i, '删除 $1'],
        [/^(\d+)\s+weeks?$/i, '$1 周'],
        [/^(\d+)\s+years?$/i, '$1 年'],
        [/^(\d+)\s+days?$/i, '$1 天'],
        [/^\s*Edit\s*$/g, '编辑'],
        [/(\d+)h/i, '$1 小时'],
        [/(\d+)d\b/, '$1 天'],
      ],
      textRules: [
        [" from AI Studio, which will give your app a public URL. It's deployed along with a proxy server that will keep your API key private, however the deployed app will use your API key for all users' Gemini API calls. You can also download your app as a zip file. If you replace the placeholder value with a real API key, it should still work. But you ", '系统将为您的应用生成公共 URL 。部署时会同步配置代理服务器以保护 API 密钥隐私，但部署后的应用将使用您的 API 密钥处理所有用户的 Gemini API 调用。您也可将应用下载为 zip 文件。若将占位符替换为真实 API 密钥，应用仍可正常运行。但您'],
        ['The import map in index.html instead of a package.json file to manage code packages. Our CDN, aistudiocdn.com, automatically finds and serves these packages for you using esm.sh, which handles versioning and dependencies. Note that some older packages not designed as ES modules (ESM) may not work correctly.', '使用 index.html 中的导入映射 (import map) 而不是 package.json 文件来管理代码包。我们的 CDN (aistudiocdn.com) 会使用 esm.sh 自动为您查找并提供这些包，esm.sh 会处理版本控制和依赖关系。请注意，一些未设计为 ES 模块 (ESM) 的旧包可能无法正常工作。'],
        ['. By default your app is private. You can share your app with other users to let them use it. Users you share your app with can see its code and fork it for their own purposes. If you share your app with edit permission, the other users can edit the code of your app. ', '。默认情况下，您的应用程序为私有状态。您可以与其他用户共享应用程序，使其能够使用该应用。被共享应用的用户可查看其代码并为自身目的进行分叉。若您授予编辑权限进行共享，其他用户即可编辑该应用的代码。'],
        ['Explore the power of FileSearch,the simplest integrated RAG solution. Just upload any text file, from product manuals to dense reports, and ask away. FileSearch takes care of the rest, instantly digging through the content to find the precise answers you need.', '探索 FileSearch 的力量，这是最简便的集成 RAG 解决方案。只需上传任意文本文件（从产品手册到长篇报告），即可提问。FileSearch 会搞定一切，即时挖掘内容并找到你需要的精准答案'],
        [" Draw and write directly on your app's preview to instantly communicate your vision to Gemini. Highlight components, sketch new ideas, or add precise feedback right where it matters. Simply pass your visual prompts to Gemini, and watch your app update live. ", '直接在应用预览上绘制和写入，立即将你的愿景传达给 Gemini。突出显示组件、草图新想法或添加精确的反馈。只需将你的视觉提示传递给 Gemini，即可实时查看应用更新'],
        ['The configuration is for working with Angular + TypeScript application. The Code Assistant is instructed to work with Angular components, services, and modules. It follows strict guidelines for using the Gemini API.', '此配置专用于 Angular + TypeScript 应用的开发工作。启用后，代码助手将专注于此框架，能深度理解其组件、服务和模块的协同工作方式，从而生成更专业、可靠且贴合项目规范的代码'],
        ['The configuration is for working with React + TypeScript application. Assumes a basic structure with index.html and index.tsx. Code Assistant follows strict guidelines for using the Gemini API', '该配置用于使用 React + TypeScript 应用程序进行了特别优化,假设具有 index.html 和 index.tsx 的基本结构,代码助理遵循严格使用 Gemini API 的准则，生成遵循 React 最佳实践的、高质量且可靠的代码'],
        [' By using this feature, you confirm that you have the necessary rights to any content that you upload. Do not generate content that infringes on others intellectual property or privacy rights. Your use of this generative AI service is subject to our ', '通过使用此功能，您确认您拥有上传内容的必要权限。请勿生成侵犯他人知识产权或隐私权的内容。您使用此生成式 AI 服务须遵守我们的'],
        ['Image output is priced at $30 per 1,000,000 tokens. Output images up to 1024x1024px consume 1290 tokens and are equivalent to $0.039 per image. Usage in AI Studio UI is free of charge', '图片生成服务按 30 $/每百万 token的价格计费。举例来说，一张不大于 1024x1024 像素的输出图片会消耗 1290 个 Token，相当于每张图片 0.039 美元。请注意，在 AI Studio 用户界面中的使用是完全免费的'],
        [' Usage information displayed is for the API and does not reflect AI Studio usage, which is offered free of charge (when no API key is selected). For latency/traffic data & method filtering please visit the ', '使用信息显示的是 API 的使用情况，不反映 AI Studio 的使用情况（在未选择 API 密钥的情况下，AI Studio 是免费的）。有关延迟/流量数据和方法过滤的信息，请访问'],
        [" An environment for building with the Gemini SDK. Go from prompt to working project. Transition to code for deeper refinement and customization. Explore and fork demos showcasing the API's full potential. ", '一个用于通过 Gemini SDK 进行构建的环境。从提示词到可运行的项目。过渡到代码以进行更深入的优化和自定义。探索和复刻可展示该 API 全部潜力的演示。'],
        ['The configuration is for working with React + TypeScript application. Assumes a basic structure with index.html and index.tsx. Code Assistant follows strict guidelines for using the Gemini API.', '该配置适用于 React + TypeScript 应用程序。假设存在包含 index.html 和 index.tsx 文件的基本结构。代码助手遵循 Gemini API 的严格使用规范。'],
        ['Image output is priced at $30 per 1,000,000 Tokens. Output images up to 1024x1024px consume 1290 tokens and are equivalent to $0.039 per image. Usage in AI Studio UI is free of charge when no API key is selected.', '图像输出每 1,000,000 Tokens 费用 $30。输出 1024x1024px 图像需要 1290 Tokens，相当于每图像 $0.039'],
        ['Image output is priced at $30 per 1,000,000 Tokens. Output images up to 1024x1024px consume 1290 tokens and are equivalent to $0.039 per image. Usage in AI Studio UI is free of charge when no API key is selected', '图像输出每 1,000,000 Tokens 为 $30。最多 1024x1024px 的图像消耗 1290 Tokens，相当于每图像 $0.039'],
        [' This list only shows API keys for projects imported into Google AI Studio. Import other projects to manage their associated API Keys. You can also create a new API Key above. ', '此列表仅显示已导入 Google AI Studio 的项目的 API 密钥。导入其他项目以管理其关联的 API 密钥。您还可以在上面创建新的 API 密钥。'],
        ['Image generation with Imagen in AI Studio has limited free quota for testing. To generate images beyond this limit or integrate Imagen into your projects, please use the Gemini API.', '在 AI Studio 中使用 Imagen 的图像生成的测试免费配额有限。要生成超过此限制的图像或将成像符集成到项目中，请使用Gemini API'],
        ['Image generation with Imagen in AI Studio has limited free quota for testing. To generate images beyond this limit or integrate Imagen into your projects, please use the Gemini API', '在 AI Studio 中使用 Imagen 生成图片有免费的测试额度。如需生成更多图片或将 Imagen 集成到您的项目中，请使用 Gemini API'],
        [" Gemini Robotics-ER, short for Gemini Robotics-Embodied Reasoning, is a thinking model that enhances robots' abilities to understand and interact with the physical world. ", ' Gemini Robotics-ER（全称 Gemini Robotics-Embodied Reasoning ）是一种思维模型，旨在增强机器人理解物理世界并与之交互的能力'],
        ['Link 2 Ink is a visual intelligence platform that transforms GitHub repositories into interactive architectural blueprints and converts web articles into concise, professional infographics.', 'Link 2 Ink 是一个视觉智能平台，能将 GitHub 代码库转化为交互式架构蓝图，并将网络文章转换为简洁专业的图表'],
        ['Video generation with Veo in AI Studio has limited free quota for testing. To generate videos beyond the free limit or to integrate Veo into your projects, please use the Gemini API.', '在 AI Studio 中使用 Veo 生成视频有免费的测试额度。如需生成更多视频或将 Veo 集成到您的项目中，请使用 Gemini API'],
        ['Discover how to use the Gemini 2.5 image model (aka nano banana) using the Gemini JS SDK in an interactive way. No need to create an API key or set up your environment.', '以交互式方式探索如何使用 Gemini 2.5 图像模型（又名 nano banana）和 Gemini JS SDK。无需创建 API 密钥或设置您的环境。'],
        [' is set to a placeholder value that you can use. When another user uses your app, AI Studio proxies the calls to the Gemini API, replacing the placeholder value with ', '该字段被设置为可供您使用的占位符值。当其他用户使用您的应用时， AI Studio 会代理调用 Gemini API ，将占位符值替换为'],
        [' Your conversations won’t be saved. However, any files you upload will be saved to your Google Drive. Logging policy still apply even in Temporary chat. See ', '你的对话将不会被保存。然而，你上传的任何文件都将被保存到你的 Google 网盘。即使在临时聊天中，日志记录政策仍然适用。请参阅'],
        ['An AI powered retro gaming experience that uses Nano Banana Pro to transform user photos into playable 8-bit sprites within a fully functional retro style maze game.', '由 AI 驱动的复古游戏体验，利用 Nano Banana Pro 将用户照片转化为可玩的 8-bit 精灵，置身于功能完备的复古迷宫游戏中'],
        ['Deploy your app as a Cloud Run Service. The app will be accessible via a public URL. Your API key will not be exposed in the app, but will be used by the application', '将您的应用部署为 Cloud Run 服务后，即可通过一个公开网址访问。您的 API 密钥不会在应用中泄露，但会被后端服务使用。'],
        ['Use your pen to control a virtual OS. Create AI wallpapers, take actions on folders, and summarize emails, leveraging the multimodal understanding capabilities of Gemini 3 Pro.', '用笔触操控虚拟操作系统。利用 Gemini 3 Pro 的多模态理解能力，创建 AI 壁纸、执行文件夹操作以及摘要邮件'],
        [' deploy your app like this, as any user will be able to see the API key. To make an app run securely outside of AI Studio requires ', '这种方式部署应用程序，因为任何用户都能看到 API 密钥。要使应用程序在 AI Studio 外部安全运行，需要将部分逻辑移至服务器端，从而避免 API 密钥暴露。'],
        ['Discover how to use the Nano Banana models (aka Gemini Image) using the Gemini JS SDK in an interactive way. No need to create an API key or set up your environment.', '探索如何通过交互式方式使用 Nano Banana 模型（即 Gemini Image）和 Gemini JS SDK。无需创建 API 密钥或配置环境'],
        ['Deploy your app as a Cloud Run Service. The app will be accessible via a public URL. Your API key will not be exposed in the app, but will be used by the application.', '将您的应用部署为 Cloud Run 服务。该应用将通过公共 URL 访问。您的 API 密钥不会暴露在应用中，但会被应用使用'],
        ['// An example instruction set for a model\n\nYou will always:\n* Use emojis instead of SVG icons\n* Do not change model strings found in code\n* Avoid using gradients', '// 模型示例指令集\n\n您必须始终：\n* 使用表情符号替代SVG图标\n* 不得修改代码中存在的模型字符串\n* 避免使用渐变效果'],
        ['Apps run in your browser in a sandboxed iframe. There is no server-side component. To run an app that requires additional services such as a backend, consider using', '应用在您浏览器中的沙盒化 iframe 中运行。没有服务器端组件。要运行需要额外服务（例如后端）的应用，请考虑使用'],
        ['When you share an app with another user, they will be able to see all of its source code. Ensure that your code does not contain any sensitive information, such as API keys.', '当您与其他用户分享应用时，他们将能看到全部源代码。请确保您的代码不含任何敏感信息，例如 API 密钥。'],
        ['Individual customer availability may vary depending on billing status and surface used: free tier, billed tier, as well as the chosen model and API features in use.', '您能使用的具体功能，取决于您的账户类型 (例如免费或付费套餐)、所选择的模型以及正在使用的特定 API 功能。'],
        ["AI Studio's GitHub integration allows you to create a repository for your work and commit your latest changes. We do not currently support pulling remote changes.", 'AI Studio 的 GitHub 集成允许您为您的工作创建一个代码库并提交您的最新更改。我们目前不支持拉取远程更改。'],
        ['Enable your app to see and understand images. Allow users to upload a photo of a receipt, a menu, or a chart to get instant data extraction, translations, or summaries.', '使您的应用能够查看和理解图像。允许用户上传收据、菜单或图表的照片，以获取即时数据提取、翻译或摘要'],
        ['Add a context-aware chatbot to your app. Give your users a support agent that remembers the conversation, perfect for multi-step bookings or troubleshooting.', '为您的应用添加一个上下文感知的智能体。为您的用户提供一个记住对话的支持智能体，非常适合多步骤预订或故障排除'],
        ['Generate stunning watercolor paintings from any Google Maps address. Your childhood home, the cafe where you met your love, all beautifully captured. Try it now!', '从任意谷歌地图地址生成令人惊叹的水彩画。您童年的家、与爱人相遇的咖啡馆，一切都将被精美捕捉。立即体验！'],
        ["A bug in the billing system is causing erroneous charges on 'Gemini 2.5 Flash Native Image Generation' for some users. All such charges will be refunded.", '计费系统中的一个错误导致部分用户的“Gemini 2.5 Flash 原生图像生成”服务出现错误收费，所有此类费用都将被退还'],
        [' in index.html instead of a package.json file to manage code packages. Our CDN, aistudiocdn.com, automatically finds and serves these packages for you using ', '，它位于 index.html 中，而非 package.json 文件，用于管理代码包。我们的 CDN (aistudiocdn.com) 会使用 '],
        ['The project will be removed from Google AI Studio, but will remain in Google Cloud. You can add it back by importing it into Google AI Studio.', '项目将从 Google AI Studio 中删除，但仍会保留在 Google Cloud 中。您可以通过将其导入 Google AI Studio 来重新添加它'],
        ['Add lightning-fast, real-time responses to your app using 2.5 Flash-Lite. Perfect for instant auto-completes, or conversational agents that feel alive.', '使用 2.5 Flash-Lite 为您的应用添加闪电般快速的实时响应。非常适合即时自动完成或感觉生动的对话式智能体'],
        ['Upload your photo and travel through time! This app uses AI to generate polaroid-style images of you reimagined in the iconic styles of different decades.', '上传您的照片，穿越时空！此应用利用 AI 生成宝丽来风格的图像，以不同年代的标志性风格重塑您的形象。'],
        ['An intelligent agent that collaborates with users to refine prompts for content creation, using a belief graph and interactive questions, powered by the Gemini API.', '基于 Gemini API 的智能体，利用信念图谱与互动提问，与你协作打磨提示词，激发创作灵感'],
        ['Help users find the key moments in long videos. Add a feature to analyze video content to instantly generate summaries, flashcards, or marketing highlights.', '帮助用户找到长视频中的关键时刻。添加一个功能来分析视频内容，立即生成摘要、抽认卡或营销亮点'],
        [' Our 2.5 Pro text-to-speech audio model optimized for powerful, low-latency speech generation for more natural outputs and easier to steer prompts. ', '我们先进的 2.5 Pro 文本到语音音频模型，优化了强大的低延迟语音生成，更自然的输出和更简单的提示控制'],
        ['Image output is priced at $120 per 1,000,000 Tokens. Output images up to 1024x1024px consume 1120 tokens and are equivalent to $0.134 per image.', '图像输出每 1,000,000 Tokens 费用 $120。输出 1024x1024px 图像需要 1120 Tokens，相当于每图像 $0.134'],
        ['Give your app a voice. Add text-to-speech to read articles aloud, provide audio navigation, or create voice-based assistants for your users.', '为您的应用赋予声音。添加文本到语音功能，大声朗读文章，提供音频导航，或为您的用户创建基于语音的助手'],
        ['Connect your app to real-time Google Search results. Build an agent that can discuss current events, cite recent news, or fact-check information.', '连接您的应用到实时 Google 搜索结果。构建一个能够讨论当前事件、引用最新新闻或核实信息的智能体'],
        ['Press Tab to use an example:\n {\n  "type": "object",\n  "properties": {\n    "response": {\n      "type": "string"\n    }\n  }\n}\n', '按 Tab 键使用示例：\n {\n  "type": "object",\n  "properties": {\n    "response": {\n      "type": "string"\n    }\n  }\n}\n'],
        ['Control the exact shape of your generated images. Build an app that creates perfect-fit images for vertical phone wallpapers or horizontal web banners.', '控制生成图像的确切形状。构建一个应用，为垂直手机壁纸或水平网页横幅创建完美契合的图像'],
        [' Our 2.5 Flash text-to-speech audio model optimized for price-performant, low-latency, controllable speech generation. ', '我们先进的 2.5 Flash 文本到语音音频模型，优化了价格和性能，低延迟，可控制的语音生成，更自然的输出和更简单的提示控制'],
        ["Experience Gemini and Grounding with Google Maps' ability to engage in real-time, voice-driven conversations for trip planning using natural language.", '体验 Gemini 与 Google 地图溯源技术的结合，使用自然语言进行实时语音对话，轻松规划行程'],
        ['To ensure that viewers are aware of an app’s usage of their webcam or other devices, we require an extra acknowledgement before the app can access these ', '为确保观看者了解应用对其网络摄像头或其他设备的使用情况，我们要求在应用访问这些 '],
        ['MCP & Gemini power your global guide! AI answers geo-queries on interactive maps. Explore, discover, and see the world anew.', 'MCP 与 Gemini 联 手打造您的全球向导！AI 可在交互式地图上回答地理位置查询。尽情探索、发现，用全新视角看世界。'],
        ['A next-generation AI wallpaper creator using Gemini 3 Pro. Generate stunning 2K and 4K backgrounds with a polished, professional interface.', '由 Gemini 3 Pro 驱动的新一代 AI 壁纸创作工具。通过精致专业的界面生成令人惊叹的 2K 和 4K 背景'],
        ['Create and simulate generative media with the latest Veo 3 Fast and GenMedia models using tldraw canvas to explore different workfflows', '使用最新的 Veo 3 Fast 和 GenMedia 模型，通过 tldraw 画布创建和模拟生成式媒体，探索不同的工作流程'],
        ['A powerful, AI photo editor. Retouch, apply creative filters, and make professional adjustments to your images using simple text prompts.', '一款强大的 AI 照片编辑器,使用简单的文本提示词对您的图像进行修饰、应用创意滤镜并进行专业调整。'],
        ["Bring images to life with Veo 3. Let users upload a product photo and turn it into a dynamic video ad, or animate a character's portrait.", '使用 Veo 3 为图像添加生命。允许用户上传产品照片并将其转换为动态视频广告，或为角色肖像添加动画'],
        ["Enter the wildest Drive Thru you've experienced. Design a custom stack, and experience the capabilities of our latest Audio 2 Audio models.", '闯入史上最狂野的“得来速”。定制你的专属层叠汉堡，体验最新 Audio 2 Audio 模型带来的听觉魔力'],
        ['Transform images into interactive p5.js code sketches with AI! Generate multiple clever, playful variations and bring your photos to life.', '借 助 AI 将图片转变为可交互的 p5.js 代码草图！生成多种巧妙有趣的版本，让您的照片焕发生机。'],
        [' Nano Banana Pro is only available for paid tier users. Link a paid API key to access higher rate limits, advanced features, and more. ', 'Nano Banana Pro 仅对付费用户层级可用，链接付费 API 密钥以访问更高的请求速率限制、高级功能等'],
        ['Use Lyria RealTime to turn your camera into an instrument. Generate a continuous and evolving stream of music based on your surroundings.', '让 Lyria RealTime 把你的镜头变成乐器。实时捕捉周围光影，生成绵延不绝、随景而变的灵感旋律'],
        ['A drawing tool that simulates fluid physics, generative sketch guides, and a conversational AI assistant that manages your creative environment.', '一款模拟流体物理的绘图工具，内置生成式素描向导，更有 AI 助手全权打理你的创作空间'],
        ['Gemini 3 Flash is your strategic co-pilot, analyzing the board and suggesting the best shots in this webcam bubble shooter.', 'Gemini 3 Flash 化身你的战术副驾。在这款摄像头控制的泡泡射击游戏中，它将实时分析局势，为你规划最佳弹道'],
        [' Please note that uploads from Google Workspace may be used to develop and improve Google products and services in accordance with our ', '请注意，从 Google Workspace 上传的内容可能会用于开发和改进 Google 产品和服务，根据我们的'],
        [' Signing in to GitHub gives you organized code storage, seamless collaboration with peers, and a powerful way to track every change. ', '登录 GitHub 可以为您提供组织化的代码存储、与同行无缝合作的功能，以及跟踪每个更改的强大方式'],
        ['This model has limited free quota for testing. To generate images beyond the limit or use the model in your projects, use the Gemini API.', '该模型的免费测试配额有限,要生成超出限制的图像或在项目中使用该模型，请使用 Gemini API'],
        ['Discover how to take your first steps with the Gemini JS SDK in an interactive way. No need to create an API key or set up your environment.', ' 通过交互式教程，轻松入门 Gemini JS SDK。无需创建 API 密钥，也无需配置开发环境。'],
        ['Add video generation to your creative app. Let users turn their blog posts, scripts, or product descriptions into short video clips.', '为您的创意应用添加视频生成功能。让用户将他们的博客文章、脚本或产品描述转换为短视频剪辑'],
        [' A collection of our favorite examples from incredible 3D games, multimodal apps, landing pages, and more for you to remix. ', '一个包含我们从精彩的 3D 游戏、多模态应用、落地页等中收藏的示例，您可以修改来创建自己的应用'],
        ["Add powerful photo editing to your app. Allow users to add objects, remove backgrounds, or change a photo's style just by typing.", '为您的应用添加强大的照片编辑功能。允许用户通过输入添加对象、移除背景或改变照片的风格'],
        [' Our native audio models optimized for higher quality audio outputs with better pacing, voice naturalness, verbosity, and mood. ', '我们先进的音频模型，优化了更高质量的音频输出，具有更好的节奏、音色自然度、冗长和情感'],
        ['A high-energy party game where you describe words to Gemini Live without using forbidden terms. Race against the clock!', '一款燃爆全场的派对游戏！挑战在不触雷禁词的情况下向 Gemini Live 描述词语。争分夺秒，极速通关！'],
        ['Using Google search grounding you are able to research topics and instantly generate verified visuals tailored to your audience.', '利用 Google 搜索溯源技术，你可以研究各类主题，并即时生成针对受众的经核实的可视化内容'],
        ["Put Gemini 3 Flash's creativity and coding abilities to the test. Rapidly generate UI, explore variations, and export code.", '考验 Gemini 3 Flash 创意与代码能力的时刻到了。极速生成 UI，探索无限变体，并直接导出代码'],
        [" Only imported projects appear here. If you don't see your projects, you can import projects from Google Cloud on this page. ", '此处仅显示已导入的项目。如果您没有看到您的项目，可以在此页面从 Google Cloud 导入项目'],
        [' (not your) API key. Do not use a real API key in your app, as the code is visible to anyone who can view your app. ', ' （非您的）API 密钥。请勿在应用中使用真实 API 密钥，因为任何能查看您应用的人都能看到该代码。'],
        ['Adjust how likely you are to see responses that could be harmful. Content is blocked based on the probability that it is harmful.', '调整安全设置：过滤可能有害的内容。系统会根据内容属于有害信息的可能性进行屏蔽。'],
        ['Enable function calling to get automatically generated responses for your function calls.', '启用函数调用功能，让 Gemini 不再“纸上谈兵”。开启后，它能连接外部工具获取实时数据 (如股价、天气)，使答案更及时、可靠'],
        ['Explore places in the world using Gemini and the Google Maps API. Ask Gemini to find you interesting places and more.', '使用 Gemini 和 Google 地图 API 探索世界。您可以让 Gemini 寻找有趣的地点，或发掘更多玩法。'],
        ['Our most intelligent model with SOTA reasoning and multimodal understanding, and powerful agentic and vibe coding capabilities', '我们最智能的模型，具有 SOTA 推理和多模态理解能力，以及强大的智能体和情感编码功能'],
        ['Upload a photo of yourself and an outfit to see how it looks on you. A virtual fitting room powered by Nano Banana.', '上传您的个人照片和心仪服装，即可轻松预览上身效果。这间虚拟试衣间由 Nano Banana™ 倾力打造。'],
        ['Connect your app to real-time Google Maps data. Build an agent that can pull information about places, routes, or directions.', '连接您的应用到实时 Google 地图数据。构建一个能够获取地点、路线或方向信息的智能体'],
        ["Unlock Gemini's vision! Detect objects in images or screenshares with interactive 2D/3D bounding boxes and points.", '解锁 Gemini 的视觉能力！通 过可交互的 2D / 3D 边界框和关键点，检测图片或屏幕共享中的物体。'],
        ['Failed to generate video, quota exceeded: due to high demand, Veo is currently at capacity. Please try again in a few moments. ', '视频生成失败，额度已用尽：由于需求过高，Veo 服务器当前负载已满，请稍后重试。'],
        ['In order to use GitHub for this app, we need you to create your own copy first. Click “Save” below to get started.', '为了将 GitHub 用于此应用程序，我们需要您先创建自己的副本。单击下面的 “保存” 开始。'],
        ['Instantly turn YouTube videos into fun learning apps using AI. Explore concepts visually and learn actively!', '借助 AI，即刻将 YouTube 视频转变 为有趣的学习应用。通过可视化方式探索概念，实现主动式学习！'],
        ['The issue has been resolved. Refunds have been issued and we expect the changes to be displayed on customer accounts within 48 hours.', '问题已解决，退款已经发出，预计变更将在 48 小时内显示在客户账户上'],
        ['A new way to develop - A/B test real-time code generations. Gemini 3 Flash evolves the perfect loading spinner.', '开发新范式——实时对生成代码进行 A/B 测试。见证 Gemini 3 Flash 进化出最完美的加载动画'],
        [' Our open model built for efficient performance on everyday devices like mobile phones, laptops, and tablets. ', ' 我们打造的开放式模型，专为在手机、笔记本电脑和平板电脑等日常设备上实现高效性能而设计'],
        ['Google AI Studio uses cookies from Google to deliver and enhance the quality of its services and to analyze traffic.', 'Google AI Studio 使用 Google 的 Cookie 来提供并优化服务品质，以及分析网站流量。'],
        ['Your AI creative coding partner for p5.js. Chat to generate interactive art and games, then edit and preview live.', '您的 p5.js AI 创意编程伙伴 。通过聊天生成交互式艺术和游戏，并进行实时编辑和预览。'],
        [' Discover how Gemini 3 Pro Image Preview redefines consistency with pixel-perfect text and total character control. ', '发现 Gemini 3 Pro Image Preview 如何重新定义与像素完美文本和总字符控制的一致性'],
        ['Generate high-quality images from a text prompt. Create blog post heroes, concept art, or unique assets in your application.', '根据文本提示生成高质量图像。创建博客文章、概念艺术或您应用中的独特资产'],
        ['In order to use GitHub for this app, we need you to create your own copy first. Click "Save" below to get started.', '为了使用 GitHub 保存此应用，我们需要你先创建一个副本。点击下方的“保存”按钮开始'],
        ['Step into the spotlight. An effortless way to cast yourself or friends in high-quality Veo videos using simple prompts.', '站上聚光灯下。只需简单的提示词，就能轻松让你或朋友成为高质量 Veo 视频的主角'],
        [' “Create an image of a fancy house by a pond in the forest in front of grassland with wildflowers, close ...” ', ' “创建一张图片，内容为森林池塘边的一栋漂亮房子，前面是长满野花的草地，近景...” '],
        ['This feature enables the model to choose to not respond to audio that’s not relevant to the ongoing conversation', '让 Gemini 拥有“抗干扰”能力，能自动忽略背景噪音或无关的旁人对话，使交流更加专注'],
        ['The number of free generations that are remaining for this model. To continue generating past the free limit, please use the Gemini API.', '此模型剩余的免费生成次数。若需继续生成，请使用Gemini API'],
        ['Sketch and prompt, Gemini brings your drawings to life! Co-create amazing art collaboratively with AI.', '寥寥几笔，加上提示词，Gemini 就能让您的画作栩栩如生！与 AI 携手，共同创作惊艳的艺术作品。'],
        ['Usage information displayed is for the API and does not reflect AI Studio usage, which is offered free of charge.', '显示的使用信息适用于 API ，不反映 AI Studio 的使用情况，该信息是免费提供的。'],
        ['An issue was discovered where links to AI Studio generated from Drive were not loading correctly within AI Studio.', '发现一个问题，即从云端硬盘生成的 AI Studio 链接无法在 AI Studio 内正确加载'],
        ['An interactive video player that lets you summarize, describe scenes, extract text, search for objects, and more.', '一款交互式视频播放器，可以帮您总结内容、描述场景、提取文字、搜索物体等等。'],
        ['Explore a dynamic gallery, dive into examples and remix video prompts to generate your own unique variations', '探索动态作品集，深入了解示例，并 通过混合改编视频提示词，生成您专属的独特作品。'],
        ['Instantly create interactive flashcards for any topic with the power of Gemini! Learn smarter, not harder.', '借助 Gemini 的强大功能，即刻为任何 主题创建交互式抽认卡！学习要用巧劲，而非蛮力。'],
        ['Lets Gemini send audio and video when speech is not detected\n\nTo change this setting, disconnect the stream first', '允许 Gemini 在未检测到语音时发送音频和视频，若要更改此设置，请先断开流连接'],
        ['“Create a video with an image: a cute creature with snow leopard-like fur is walking in a winter forest.”', '“用一张图片创建一个视频：一只长着雪 豹般皮毛的可爱生物正在冬天的森林里行走。”'],
        ['Sketch and prompt, Gemini brings your drawings to life! Co-create collaboratively with AI by sketching and prompting.', '素描加提示，Gemini 让您的画作栩栩如生！通过素描和提示与 AI 协同创作。'],
        ["“Create a horizontally oriented rectangular stamp that features the Mission District's vibrant culture...”", '“创建一个以米慎区 (Mission District) 充满活力的文化为特色的横向矩形邮票...”'],
        ['Upload an image of a board game, floor layout, or anything you can think of to turn it into an interactive experience.', '上传一张棋盘游戏、地板布局或任何您想到的图片，将其转换为互动式体验'],
        ['Tiny cats explain! Get fun, illustrated slideshows breaking down complex topics with adorable feline metaphors.', '让小猫咪为您讲解！用生动有趣的幻灯片和可爱的猫咪比喻，轻松理解复杂主题。'],
        [" This functionality is not yet available. We're excited to support more use-cases for apps in the future. Please consider ", '此功能尚不可用。我们很高兴将来能为应用支持更多的用例。请考虑'],
        ["Only API Keys for imported projects appear here. If you don't see your API keys, you can import projects on the ", '此处仅显示已导入项目的API密钥。若未找到您的API密钥，你可以在导入项目在'],
        [' As a reminder, recordings of your interactions with the Live API and content you share with it are processed per the ', '提醒您，您与 Live API 互动的录制内容以及您与之共享的内容将根据'],
        [' Our most intelligent model built for speed, combining frontier intelligence with superior search and grounding. ', '我们为速度而构建的最智能的模型，将前沿智能与卓越的搜索和定位相结合'],
        ['Discover amazing places, plan your perfect day trips, and visualize your adventures on an interactive map.', '发现绝佳去处，规划完美的一日游，并 在交互式地图上直观地展现您的冒险路线。'],
        ['Experience real-time voice chat with 3D visuals react to your conversation, bringing AI interaction to life.', '体验实时语音聊天，3D 视觉效果会随您的对话动态变化，让 AI 互动栩栩如生。'],
        ['Google AI Studio does not show all your Cloud Projects. To import them, search by name or project ID.', 'Google AI Studio 不显示所有您的 Cloud 项目。要导入它们，请按名称或项目 ID 搜索'],
        ['The fix was deployed to the production environment. Drive-generated links now load correctly in AI Studio.', '修复已部署到生产环境，由云端硬盘生成的链接现在可以在 AI Studio 中正确加载'],
        ['A professional design studio that generates photo realistic product mock-ups from uploaded or AI created assets.', '专业设计工作室，可利用上传或 AI 生成的素材制作照片级逼真的产品样机'],
        ['API pricing per 1M tokens. Usage in AI Studio UI is free of charge when no API key is selected', '每个 1M Tokens 的 API 费用。在未选择 API 密钥的情况下，AI Studio UI 中的使用是免费的'],
        [' Our latest image generation model, with significantly better text rendering and better overall image quality. ', '我们最新的图像生成模型，具有显著更好的文本渲染和更好的整体图像质量'],
        ['Gemini 3 Flash quickly reasons through synthetic customer data and chat transcripts into unified records.', 'Gemini 3 Flash 极速推理合成客户数据与聊天记录，抽丝剥茧，整合为统一档案'],
        ['*: This is an estimated cost if you make the same request via API. Usage on AI Studio is free.', '*: 如果您通过 API 发出相同的请求，这是一个估计成本。在 AI Studio 上使用是免费的。'],
        ['An interactive tool that allows you to design, test, and banter with custom AI characters on the fly.', '一款交互式工具，让您可以即时设计、测试自定义 AI 角色，并与之轻松互动闲聊。'],
        ['Describe any scene and get a stunning video in seconds. An effortless video generator powered by Veo.', '描述任意场景，几秒钟内即可获得令人惊叹的视频。由 Veo 驱动的轻松视频生成器'],
        ['Higher resolutions may provide better understanding but use more tokens.', '更高的分辨率能让 Gemini 看清图像细节，提升分析质量，但这会消耗更多 Token，通常意味着费用更高、速度更慢'],
        ['Effortless dictation powered by Gemini. Turn long rambling recordings into perfectly transcribed notes.', '由 Gemini 驱动的轻松听写功能。将冗长杂乱的录音转为条理清晰的文字笔记。'],
        ['Lets you define functions that Gemini can call This tool is not compatible with the current active tools.', '允许您定义可供 Gemini 调用的函数。此工具与当前已启用的工具不兼容。'],
        ['Set how much the model should think, 0 tokens being not at all and 24576 being as much as possible', '设置模型应该思考多少Tokens，0个Token表示不考虑，24576个Tokens表示考虑更多'],
        ["Give your app's AI time to think. Enable 'Thinking Mode' to handle your users' most complex queries.", '为您的应用的 AI 提供思考时间。启用“思考模式”以处理您用户的最复杂查询'],
        ['The entire contents of earlier versions of the files of your app if they changed in this session', '如果在本次会话中您的应用文件发生了更改，这里会包含文件早期版本的全部内容。'],
        ['Add custom instructions for your project to control style, models used, add specific knowledge, and more.', '为您的项目添加自定义说明，以控制样式、使用的模型、添加特定知识等'],
        ['Give your Google Map a new personality to match your brand, your mood, or the spirit of your favorite holiday', '为你的 Google 地图赋予新个性，以匹配你的品牌、心情或节日氛围'],
        ['The fix resulted in a significant improvement. The issue is considered resolved. Monitoring for remaining issues.', '修复带来了显著改善，该问题被视为已解决，正在监控其余问题'],
        ['Let the model decide how many thinking tokens to use or choose your own value', '设置模型用于“思考和推理”的计算量。值越高，越有助于解决复杂难题，但也会增加响应时间和费用'],
        [' Animate images to life, generate videos with a prompt, and more with Veo 3.1 in your apps. ', '在您的应用中使用 Veo 3.1，让图像动起来、通过提示词生成视频，并实现更多功能'],
        ['Build Photoreal 3D maps with natural language using a Gemini-powered Agent and MCP tool.', '使用由 Gemini 驱动的 Agent 和 MCP 工具，通过自然语言构建照片级真实的 3D 地图。'],
        ["You don't have any Google Cloud projects with a paid quota tier. If you want to use the paid tier,", '您没有任何已启用付费方案的 Google Cloud 项目。如果您想使用付费方案，'],
        [" “An evocative image of an English afternoon tea table with newspaper headline of 'Gemini 2.5' ...” ", '“一张引人入胜的英式下午茶桌图片，报纸头条为‘Gemini 2.5’...”'],
        ['Explore an infinite wiki where every word is a hyperlink to descriptions generated in real-time.', '探索一个无限的知识库，其中每个词都是一个超链 接，指向实时生成的解释。'],
        ['Lets you define functions that Gemini can call\n\n This tool is not compatible with the current active tools.', '允许您定义 Gemini 可调用的函数，此工具与当前活动工具不兼容'],
        ['Start building with Gemini, try “Build me an AI photo editing app using Nano Banana”', '使用 Gemini 开始构建，尝试“使用 Nano Banana 为我构建一个 AI 照片编辑应用程序”'],
        ['Let Gemini adapt its response style to the input expression and tone', '让 Gemini 的回应更有“人情味”。它会尝试感知您的情绪和语气，并用相应的风格来回应，使交流更有共鸣'],
        ['Set how much the model should think, with 32768 being as much as possible', '设定模型的“思考”计算量 (上限 32768)。更高的值能提升复杂推理能力，但会增加费用和响应时间。'],
        ['Lets you define functions that Gemini can call\n\nTo change this setting, disconnect the stream first', '允许您定义 Gemini 可以调用的函数，若要更改此设置，请先断开流连接'],
        ['Builds apps using the SDK without a key, try “an image generator that uses Imagen”', '无需 API 密钥即可使用 SDK 构建应用，例如试试“一个使用 Imagen 的图片生成器”。'],
        ['Lets Gemini use code to solve complex tasks\n\n This tool is not compatible with the current active tools.', '让 Gemini 用代码解决复杂的任务，此工具与当前活动工具不兼容'],
        ["No speakers detected. Please ensure your script's speaker names are also set in the right sidebar.", '未检测到发言人，请确保您已在右侧边栏中设置了脚本对应的发言人名称'],
        ['Effortless flashcards on any subject. Just name a topic, and Gemini creates your study deck.', '轻松制作任意主题的抽认卡。只需指定主题，Gemini 就会为你创建学习卡片组'],
        ['Chat with Gemini to explore and understand the Gemini API documentation using the URL Context tool.', '与 Gemini 聊天，使用URL上下文工具探索和理解 Gemini API 文档。'],
        ['Your personal time machine. Gemini reimagines you in past decades with character consistency.', '你的个人时光机。Gemini 在保持角色一致性的前提下，重构过去几十年的你'],
        ['Enable a sliding context window to automatically shorten chat history by removing the oldest turns.', '启用滑动上下文窗口，通过移除最早的对话轮次来自动精简聊天记录'],
        ['Extra text was returned in Gemini API responses and on AI Studio with Gemini 2.5 models.', '在使用 Gemini 2.5 模型的 Gemini API 响应和 AI Studio 中返回了额外的文本'],
        ['“Create a video showing some hands first sprinkling salt into a pan of stir-fried vegetables...“', '“创建一个视频，画面中一双手先将盐撒入一锅翻炒的蔬菜中……”'],
        ['Let Gemini transform your images into living, interactive p5.js sketches, coded on the fly.', '让 Gemini 将你的图像转化为生动的、可交互的 p5.js 草图，代码实时编写'],
        ['Race through a stunning synthwave cosmos at breakneck speeds in this retro-futuristic runner.', '在这款复古未来主义的跑酷游戏中，以极速穿梭于令人惊叹的合成波宇宙'],
        ['Use the Gemini Live API to give your app a voice and make your own conversational experiences.', '使用 Gemini 实时 API 为您的应用赋予声音，打造您自己的对话式体验'],
        [' Apps in Build may not load due to global Cloudflare outage. Mitigations are underway. ', '构建中的应用可能由于全局 Cloudflare 中断而无法加载，正在进行缓解措施'],
        ['A playground to discover the range of creative voices that the Gemini native audio out has to offer.', '一个可以体验 Gemini 原生音频各种创意声音 的“游乐场”。'],
        [' Our state-of-the-art video generation model, available to developers on the paid tier of the Gemini API. ', '我们最新的视频生成模型，可在付费 Gemini API 使用'],
        ['. Note that some older packages not designed as ES modules (ESM) may not work correctly. ', '。请注意，一些未设计为 ES 模块 (ESM) 的旧软件包可能无法正常工作。'],
        ['Embed Gemini in your app to complete all sorts of tasks - analyze content, make edits, and more', '将 Gemini 嵌入您的应用以完成各种任务 - 分析内容、进行编辑等'],
        ['Generate, edit, and preview interactive p5.js art and games simply by chatting with Gemini.', '只需与 Gemini 聊天，即可生成、编辑和预览交互式 p5.js 艺术和游戏'],
        ['Strike a pose for a Gemini-powered 80s photo, then animate it instantly with Veo.', '摆个姿势拍一张由 Gemini 驱动的 80 年代风格照片，然后用 Veo 让它瞬间动起来'],
        [' Respect others’ privacy and ask permission before recording or including them in a Live chat.\n', '请尊重他人的隐私，在录制或将其加入实时聊天之前先征得同意\n'],
        ['Further investigation determined the issue affected all Drive-generated links for AI Studio.', '进一步调查确定该问题影响了所有为 AI Studio 生成的云端硬盘链接'],
        ['Query the globe and get answers instantly visualized, with Gemini grounded by MCP.', '查询全球资讯并即时获得可视化答案，由 MCP 提供数据支撑的 Gemini 为您服务'],
        ['Sources are provided when a significant portion of the model response\n  comes from a particular source.', '当模型响应的显著部分来自特定来源时，将提供来源信息'],
        ['Upload a photo of yourself and an outfit to see how it looks on you, powered by Nano Banana.', '上传你自己的照片和一套服装，看看上身效果，由 Nano Banana 驱动'],
        ["Unleash Gemini's creative TTS voices and see their characters come to life with Imagen.", '释放 Gemini 充满创意的 TTS 语音能力，并利用 Imagen 让角色栩栩如生'],
        [' apply to use of apps featured on the Showcase tab in AI Studio, unless otherwise noted. ', '适用于 AI Studio“展示”选项卡中特色应用的使用，除非另有说明。'],
        ['Are you sure you want to delete your prompt and generated output? This action cannot be undone.', '您确定要删除您的提示词和已生成的内容吗？此操作无法撤销。'],
        ['Infinitely zoom into any image with this creative enhancer. See if you can find the easter egg.', '利用这款创意增强工具无限放大任意图像。看看你能否找到彩蛋'],
        ['Usage is only reflective of Imagen and Veo requests. Other request types are not yet supported.', '使用情况仅反映 Imagen 和 Veo 请求，其他请求类型尚未支持'],
        ['Ground responses with Google Search.\n\nTo change this setting, disconnect the stream first', '使用 Google 搜索作为回答依据，若要更改此设置，请先断开流连接'],
        ['Instantly convert any YouTube video into an interactive learning app, coded by Gemini.', '将任意 YouTube 视频瞬间转化为交互式学习应用，代码由 Gemini 编写'],
        ['An interactive demo of how Gemini provides robots with critical spatial understanding.', '一个交互式演示，展示 Gemini 如何为机器人提供关键的空间理解能力'],
        ['An issue affecting some users using the OpenAI library with the Gemini API was reported.', '据报告，一个影响部分使用 OpenAI 库与 Gemini API 的用户的问题'],
        ['Gemini API and AI Studio are unavailable for some users. We are investigating the issue.', '部分用户无法使用 Gemini API 和 AI Studio，我们正在调查此问题'],
        ['Explore a gallery of stunning Veo videos and remix their prompts to create your own.', '探索令人惊叹的 Veo 视频库，并重新混合其提示词来创作你自己的作品'],
        [' You have reached a rate limit. Set up billing to increase your limits and unblock your work. ', '您已达到速率限制，请设置计费以增加限制并解锁您的工作'],
        ['Usage is only reflective of GenerateContent requests. Other request types are not yet supported.', '用量仅反映 “生成内容” 请求，其他请求类型暂不支持'],
        [' may make mistakes, so double-check its response. Gemma is provided under and subject to the ', '可能会出错，因此请仔细检查其响应。Gemma 根据使用条款'],
        ['Released Gemini 2.0 Flash, 2.0 Flash-Lite Preview, 2.0 Pro Experimental, and more', '发布了 Gemini 2.0 Flash、2.0 Flash-Lite 预览版、2.0 Pro 实验版等'],
        ['Transform any Google Maps location into a stunning watercolor painting with Nano Banana.', '使用 Nano Banana 将任意 Google 地图地点转化为迷人的水彩画'],
        ['Use a single voice with advanced tone and emotion controls or simulate a two-voice dialogue', '使用具有高级音调和情感控制的单人语音，或模拟双人对话。'],
        ['A retro-futuristic 3D arcade game where players navigate space and battle enemies.', '一款复古未来主义的 3D 街机游戏，玩家将在太空中穿梭并与敌人战斗'],
        ['At the moment these libraries are not supported, because of limited support for compiler plug-ins.', '目前不支持这些库，因为对编译器插件的支持有限。'],
        ['Probability threshold for top-p sampling', '筛选出一个“精英候选词”的范围。值越高，候选范围越大，回复更多样；值越低，范围越小，回复也更专注和可预测'],
        ["Turn real routes into immersive audio stories synced to your journey's exact duration.", '将真实路线转化为沉浸式有声故事，剧情时长与你的旅途分秒同步'],
        ['Speak, and the orb responds. An interactive experience powered by the Live Audio API.', '你只需开口，光球即会回应。由 Live Audio API 驱动的互动体验'],
        ['You are responsible for ensuring that safety settings for your intended use case comply with the', '您有责任确保安全设置符合您预期用途的相关规定 。'],
        [" “The building's primary structure mimics a colossal, ancient banyan tree, with a ...” ", ' “该建筑的主要结构模仿一棵巨大而古老的榕树，其...” '],
        ['Chat with any video to instantly summarize, find objects, or extract text with Gemini.', '与任意视频对话，利用 Gemini 即时总结、查找物体或提取文本'],
        ['See the URL Context tool in action. Chat with Gemini to explore API documentation.', '查看 URL 上下文工具的实战效果。与 Gemini 聊天以探索 API 文档'],
        [' apply to use of apps featured in the app gallery in AI Studio, unless otherwise noted. ', '适用于 AI Studio 应用库中应用的使用，除非另有说明。'],
        [" You don't have any projects with a paid quota tier. If you want to use the paid tier, ", '您当前没有使用付费配额层级的项目，若需启用付费层级，'],
        [' Switching to this model will start a new chat.\n        Content in current chat will be lost. ', '切换到此模型将开始新对话，当前对话内容将丢失'],
        ['(aka Gemini 2.5 Flash Image) State-of-the-art image generation and editing model.', '（又名 Gemini 2.5 Flash Image）最先进的图像生成和编辑模型'],
        ['Let Gemini plan your perfect day trip and instantly visualize it on Google Maps.', '让 Gemini 规划你的完美一日游，并在 Google 地图上即时可视化'],
        ['Our hybrid reasoning model, with a 1M token context window and thinking budgets.', '我们的混合推理模型，拥有 100 万 Token 上下文窗口和思考预算'],
        [' You have no Paid Project. Please view the Projects Page to choose a Project and Upgrade. ', '您没有付费项目，请查看项目页面选择项目并升级。'],
        ['Ask Gemini to find any place on Earth and explore it instantly on Google Maps.', '让 Gemini 寻找地球上的任何地方，并即时在 Google 地图上探索'],
        ['API pricing per 1M tokens. Usage in AI Studio UI is free of charge', 'API 定价以每百万 token 为单位计算,在 AI Studio 界面中的使用则完全免费'],
        ['Users are experiencing throttling issues with Gemini 2.0 Flash and 1.5 Pro models.', '用户正遇到 Gemini 2.0 Flash 和 1.5 Pro 模型的限流问题'],
        [" Try Gemini's natural, real-time dialogue experience, with audio and video inputs ", '尝试 Gemini 的自然、实时对话体验，支持音频和视频输入'],
        ['Instantly transform your text prompts into charming animated doodles with Gemini.', '使用 Gemini，即刻将您的文本提示词变为有趣的动画涂鸦。'],
        ['Lets Gemini send audio and video when speech is not detected', '允许 Gemini 在您停顿或未说话时也能主动回应，使音视频对话体验更流畅、自然。'],
        ['Model used to generate response\n\nTo change this setting, disconnect the stream first', '用于生成回答的模型，若要更改此设置，请先断开流连接'],
        ['For Gemini 3, best results at default 1.0. Lower values may impact reasoning.', '对于 Gemini 3，默认值 1.0 效果最佳。较低值可能会影响推理'],
        ['Generate structured output This tool is not compatible with the current active tools.', '生成结构化输出。此工具与当前已启用的工具不兼容。'],
        ['Let Gemini turn your messy audio recordings into clean, perfectly structured notes.', '让 Gemini 将你杂乱的录音转化为干净、结构完美的笔记'],
        ['Teach me a lesson on quadratic equations. Assume I know absolutely nothing about it', '给我讲一堂关于一元二次方程的课，假设我对此一无所知'],
        [" Try Gemini's natural, real-time dialog experience, with audio and video inputs ", '尝试 Gemini 的自然、实时对话体验，包括音频和视频输入'],
        ['Lets you define functions that Gemini can call', '允许您定义可供 Gemini 调用的函数,让 AI 能调用外部工具 (如 API) 来获取实时信息 (如天气)'],
        [' “Photorealistic long exposure photograph of a subway platform, straight-on view.” ', ' “地铁站台的写实风格长曝光照片，正面视角。” '],
        [' Turn the panda into an adventurer archaeologist in a lush Mayan jungle. ', '让熊猫化身为一名冒险考古学家，置身于植被丰茂的玛雅丛林之中'],
        ['An arcade cricket game where Gemini is your personal, live sports commentator.', '一款街机板球游戏，Gemini 将化身你的个人实时体育解说员'],
        ['Generate structured outputs\n\n This tool is not compatible with the current active tools.', '生成结构化输出\n\n 此工具与当前活动工具不兼容'],
        ['Simulate a computer with a UI that is generated dynamically from user interactions.', '模拟一台计算机，其用户界面根据用户交互动态生成。'],
        ['Add a feature to provide live, real-time transcription of any audio feed for your users.', '为您的用户添加一个功能，实时转录任何音频流'],
        ['Our most powerful reasoning model, which excels at coding and complex reasoning tasks.', '我们最强大的推理模型，擅长编码和复杂推理任务'],
        ['The issue is mitigated. We are keeping the incident open to monitor the situation.', '问题已缓解，我们将保持此事件为开启状态以监控情况'],
        ['Create and combine AI media, blending Veo and Imagen on a single canvas.', '创建并组合 AI 媒体，在一个画布上融合 Veo 和 Imagen 的能力'],
        ['Creativity allowed in the responses', '调整模型回复的创造力，值越高，回复越有想象力但可能不准确；值越低，回复越严谨专注但可能比较刻板'],
        ['Show me different logos and brand swag ideas for my startup called Avurna', '为我名为 Avurna 的初创公司展示不同的标志和品牌周边创意。'],
        ['To allow the model to view URLs, turn on URL Context under Tools.', '如需允许模型查看网址内容，请在“工具”中开启“网址上下文”功能。'],
        [' Can I develop apps locally with my own tools and then share them here? ', ' 我可以使用自己的工具在本地开发应用，然后在这里共享吗？ '],
        [' Create a fashion product collage on a brown corkboard based on this outfit. ', '根据这组衣服创建一个棕色 Corkboard 上的时装产品拼接'],
        ['Apps or services using this key will stop working. This action cannot be undone.', '使用此密钥的应用或服务将停止工作，此操作无法撤销'],
        [' Create an illustrated explainer, detailing the physics of the fluid dynamics. ', '创建一个插图解释器，详细说明流体动力学的物理原理'],
        [' Gemini API Logs may not appear for some users. Investigation is underway. ', '某些用户的 Gemini API 日志可能无法显示，正在进行调查'],
        ['Detect the precise 2D/3D location of objects in any image or live screenshare.', '检测任意图像或实时屏幕共享中物体的精确 2D/3D 位置'],
        ['Users are experiencing throttling issues with Gemini 1.5 Pro and Flash models.', '用户正遇到 Gemini 1.5 Pro 和 Flash 模型的限流问题'],
        ['Explore a retro OS that brings back nostalgic memories with an AI twist.', '探索一款复古操作系统，体验 AI 为其注入的全新怀旧风情。'],
        ['Throttling issues with Gemini 2.0 Flash and 1.5 Pro models have been resolved.', 'Gemini 2.0 Flash 和 1.5 Pro 模型的限流问题已解决'],
        [' Our advanced reasoning model, which excels at coding and complex reasoning tasks', '我们先进的推理模型，擅长编码和复杂的推理任务'],
        ['Browse the url context\n\n This tool is not compatible with the current active tools.', '浏览网址上下文，此工具与当前活动工具不兼容'],
        ['Describe the style of your dialog, e.g. "Read this in a dramatic whisper"', '描述您对话的风格，例如：“用充满戏剧性的耳语来朗读”'],
        ["Don't use a real API key in your app. Use a placeholder value instead.", '请勿在您的应用中使用真实的 API 密钥，而应使用占位符值。'],
        ['Set the scene for any meeting - Build the hype with Gemini Text To Speech', '掌控会议气场——用 Gemini 文本转语音功能瞬间拉满氛围'],
        ['Enter a place and time to hear imagined conversations from the past.', '穿越时空，指定地点与年代，聆听一段来自历史长河的遐想对话'],
        ['Your prompt is being queued. Your generated video will appear here shortly', '您的提示词已加入队列。生成的视频稍后将在此处显示。'],
        [' Failed to list bundled Applications: permission denied. Please try again. ', '加载捆绑应用程序时出错：权限被拒绝。请再次尝试。'],
        [' Gemini 2.5 Flash Image, state-of-the-art image generation and editing ', ' Gemini 2.5 Flash Image，最先进的图像生成和编辑模型'],
        ['Select media resolution\n\nTo change this setting, disconnect the stream first', '选择媒体分辨率，若要更改此设置，请先断开流连接'],
        ['Use Google Search\n\n This tool is not compatible with the current active tools.', '使用 Google 搜索，此工具与当前活动工具不兼容'],
        ['Our most balanced multimodal model with great performance across all tasks.', '我们最均衡的多模态模型，在所有任务中都表现出色'],
        [' Display of Search Suggestions is required when using Grounding with Google Search. ', '使用 Google 搜索时，显示搜索建议功能'],
        ["An interactive sandbox for Gemini's native audio and function calling.", '一个用于体验 Gemini 原生音频和函数调用的交互式沙盒'],
        ['Our smallest and most cost effective model, built for at scale usage.', '我们最小、最具成本效益的模型，专为大规模使用而构建'],
        ['Select or upload a file on Google Drive to include in your prompt', '从 Google 云端硬盘选择或上传文件，以包含在您的提示词中'],
        ['Select the model voice\n\nTo change this setting, disconnect the stream first', '选择模型语音，若要更改此设置，请先断开流连接'],
        ['Video Understanding is unavailable for some users. Investigation is underway.', '部分用户无法使用视频理解功能，正在进行调查'],
        ["Describe an object, icon, or scene, and we'll render it as vector art.", '描述物体、图标或场景，我们将为您渲染成矢量艺术图'],
        ['Peak usage per model compared to its limit over the last 28 days', '过去 28 天内，每个模型实际使用量与其配额上限的对比情况'],
        ['Submitting this feedback report will send the following information to Google:', '提交此反馈报告将向 Google 发送以下信息：'],
        ['Throttling issues with Gemini 1.5 Pro and Flash models have been resolved.', 'Gemini 1.5 Pro 和 Flash 模型的限流问题已解决'],
        ["Try Gemini's natural, real-time dialog with audio and video inputs", '体验 Gemini 自然流畅的实时对话，支持音频和视频输入。'],
        ['Create animated GIFs with Nano Banana from your images and prompts.', '使用 Nano Banana 根据你的图片和提示词制作 GIF 动图'],
        [' Gemini 2.5 Flash Image, state of the art image generation and editing ', 'Gemini 2.5 Flash 图像，最先进的图像生成和编辑'],
        ['Failed to open the camera. Check permissions in the browser and try again.', '无法打开摄像头。请检查浏览器权限并重新尝试'],
        ['Gemini 3 Flash controls 100 tools in a simulated kitchen.', '看 Gemini 3 Flash 如何在模拟厨房中游刃有余地驾驭 100 种工具'],
        [' Allow Google AI Studio access to Drive to view saved apps ', '允许 Google AI Studio 访问云端硬盘以查看已保存的应用程序'],
        ['API key requests may fail for some users. Investigation is underway.', '部分用户的 API 密钥请求可能会失败，正在进行调查'],
        ['Gemini brings professional, prompt-based photo editing to your fingertips.', 'Gemini 让基于提示词的专业照片编辑触手可及'],
        ['Get SDK code to interact with Gemini Live', '获取可直接使用的代码 (SDK)，让您自己的应用程序也能连接并使用 Gemini 的能力'],
        ['Lets Gemini use code to solve complex tasks', '允许 Gemini 运行代码，从而能准确地进行数学计算、数据分析或处理文件等任务'],
        ['Use the long context for analyzing large datasets, codebases or documents', '使用长上下文分析大型数据集、代码库或文档。'],
        ['Generate images, Flash annotates and makes them interactive.', '生成图像的同时，Flash 即刻进行智能标注并赋予其交互能力'],
        ['Open model built for running with high efficiency on low-resource devices.', '为在低资源设备上高效运行而构建的开放模型'],
        ['Truncate response including and after string', '设定一个“刹车词”，当模型准备生成这个词（或短语）时，就会立刻停止输出'],
        [" No apps yet. As you build and view apps, they'll appear here. ", '暂无应用，您可以在构建和查看应用后，在这里查看它们'],
        [' Switch to a paid API key to unlock higher quota and more features. ', '切换到付费 API 密钥以解锁更高配额和更多功能。'],
        ['Use your webcam to track hand movements and slash Sparks to the beat.', '利用网络摄像头追踪手部动作，跟随节拍斩击火花'],
        ['Build and banter with your own AI characters using the Live API.', '使用 Live API 构建你自己的 AI 角色并与之谈笑风生'],
        ['ListModels requests fail for all users. Investigation is underway.', '所有用户的 ListModels 请求均失败，正在进行调查'],
        ['Research paper reimagined as an elegant, interactive narrative site.', '将研究论文重构为一个优雅的、互动式的叙事网站'],
        ['Speaker names must be consistent with speakers used in your prompt', '发言人姓名必须与提示词中使用的发言人保持一致。'],
        [' Google AI models may make mistakes, so double-check outputs.', 'Google AI 模型可能会出错，因此请仔细检查其输出内容'],
        ['Add new features or easily modify this app with a prompt or the suggestions below', '添加新功能或轻松修改此应用程序'],
        ['Generate a scavenger hunt for street food around the city of Seoul, Korea', '为韩国首尔市的街头小吃设计一个寻宝游戏'],
        ['The below reflects how to structure your script in your API request.', '以下示例展示了如何在 API 请求中构建您的脚本'],
        ['This model is not stable and may not be suitable for production use', '此模型尚不稳定，可能不适合在生产环境中使用。'],
        [' Branch out from one generation to the next with multimodal workflows ', '多模态工作流，从一种生成方式分支到下一种'],
        [' Create an orthographic blueprint that describes this building in plan. ', '创建一个正交蓝图，描述这栋建筑的平面图'],
        ['. App creators can add these permission requests to their app’s ', '. 应用创建者可以将这些权限请求添加到其应用的 '],
        ['A fix was implemented and submitted to address the issue with link handling.', '已实施并提交修复以解决链接处理问题'],
        ['Changes to the safety settings below apply to text inputs and outputs.', '以下安全设置的更改适用于文本输入和输出。'],
        ['Compare Gemini 3 Flash generation speeds against other models.', '直观对比 Gemini 3 Flash 与其他模型的生成速度差异'],
        ['Generate structured output', '生成结构化输出,让 AI 按固定的格式 (如 JSON) 回答，使其输出能像数据一样被程序直接使用'],
        ['Open model that can handle complex tasks with visual and text input.', '能够处理复杂的视觉和文本输入任务的开放模型'],
        ['Our best image generation model yet, engineered for creativity', '我们迄今为止最强大的图片生成模型，专为创意而生。'],
        ['Plot sin(x) from 0 to 2*pi. Generate the resulting graph image.', '绘制 sin(x) 从 0 到 2*pi 的函数图像，并生成图片'],
        [' The specified model was not recognized. The default model will be used. ', '指定的模型未被识别，将使用默认模型。'],
        ['“Generate a hyper-realistic, studio-quality product ad...”', '“生成一则超逼真、具有专业影棚质感的产品广告...”'],
        ['Create, visualize, and rebuild sculptures using the same set of blocks.', '创建、可视化并使用相同的积木块重建雕塑'],
        ['Manage a virtual metropolis and fulfill tasks provided by Gemini.', '管理一座虚拟大都会，并完成 Gemini 下达的任务'],
        ['Physics sandbox for simulating variable gravity and collision dynamics.', '用于模拟可变重力和碰撞动力学的物理沙盒'],
        [' What terms apply to the Showcase apps featured in AI Studio? ', ' 哪些条款适用于 AI Studio 中的“展示”应用？ '],
        ['Enter a list of function declarations for the model to call upon. See the', '输入一组函数声明供模型调用。请参阅'],
        ['Generate a Docker script to create a simple linux machine.', '生成一个 Docker 脚本来创建一个简单的 Linux 虚拟机'],
        ['Mitigations were deployed, and error levels are back to nominal levels.', '缓解措施已部署，错误率已恢复正常水平'],
        [' You can then view your Gemini API history and create datasets. ', '您可以查看 Gemini API 历史记录并创建数据集'],
        ['Number of tokens kept in context after sliding the context window', '上下文窗口滑动后，保留的 Token (令牌)数量'],
        ['Some requests across all models were failing with 500 or 503 errors.', '所有模型的部分请求出现 500 或 503 错误'],
        [' “Create an image of fuzzy bunnies next to a glass of...” ', ' “创建一张毛茸茸的兔子在玻璃杯旁的图片...” '],
        ['Insert files (text, images, audio, video) into your prompt.', '将文件（文本、图像、音频、视频）插入您的提示词'],
        ['Upload a file to Google Drive to include in your prompt', '将文件上传到 Google 云端硬盘，以包含在您的提示词中'],
        ['AI Studio uses Google Drive to store apps, and inherits', ' AI Studio 使用 Google Drive 存储应用程序，并继承'],
        ['Insert assets such as images, videos, folders, files, or audio', '插入图片、视频、文件夹、文件或音频等资源。'],
        ['Number of tokens accumulated before sliding the context window', '上下文窗口滑动前，累积的 Token (令牌) 数量'],
        ['Open model that can handle visual and text input with low latency.', '能够低延迟处理视觉和文本输入的开放模型'],
        ['Select or Upload a file on Google Drive to send to the model', '从 Google 云端硬盘选择或上传文件以发送给模型'],
        ["'Item: Apple, Price: $1'. Extract name, price to JSON.", '从“商品：苹果，价格：$1”中提取名称和价格为 JSON'],
        ['Users are experiencing unavailability issues with Gemini 2.5 Pro.', '用户正遇到 Gemini 2.5 Pro 不可用的问题'],
        [' “Create an image of sushi on a table, oil painting style.” ', ' “创建一张桌上寿司的图片，油画风格。” '],
        [' This model is not stable and may not be suitable for production use. ', '此模型不稳定，不适合用于生产环境'],
        ['Gemini API throttling some users using the OpenAI library', 'Gemini API 对部分使用 OpenAI 库的用户进行限流'],
        ['Gemini automatically generates a response for each function call.', 'Gemini 会为每个函数调用自动生成响应。'],
        ['Peak usage per model compared to its limit over the last 90 days', '模型过去 90 天内的使用量与其限制的对比'],
        ['Users are experiencing unavailability issues with Gemini 2.5 Pro', '用户正遇到 Gemini 2.5 Pro 不可用的问题'],
        [' Failed to list models: permission denied. Please try again. ', '列出模型时出错：权限被拒绝。请再次尝试。'],
        [' Generate high quality text to speech with Gemini TTS models ', '使用 Gemini TTS 模型生成高质量文本到语音'],
        [' See the speed and intelligence of Gemini 3 Flash in action. ', '见证 Gemini 3 Flash 极速与智慧的实战表现'],
        ['Open model built for handling text-only tasks with low latency.', '为低延迟处理纯文本任务而构建的开放模型'],
        ['Users are experiencing throttling issues with Gemini 2.0 Flash.', '用户正遇到 Gemini 2.0 Flash 的限流问题'],
        ['Peak usage per model compared to its limit over the last 7 days', '模型过去 7 天内的使用量与其限制的对比'],
        ['You need to create and run a prompt in order to share it', '您需要先创建并运行提示词，然后才能进行分享。'],
        [' Closing the chat will lose the data. Do you want to continue? ', '关闭聊天将丢失数据，您确定要继续吗？'],
        [' Users are experiencing throttling issues with Gemini 1.5 Pro. ', '用户正遇到 Gemini 1.5 Pro 的限流问题'],
        ['A balanced choice for general purpose use and solid quality', '一个平衡的选择，用于一般用途和扎实的质量'],
        ['A serene e-commerce sample experience with an AI concierge.', '一个宁静的电商示例体验，配有 AI 礼宾服务'],
        ['Drag, drop, and visualize any product in your personal space.', '在您的个人空间中拖放并可视化任何产品。'],
        ['Gemini API and AI Studio File Service / Veo outages.', 'Gemini API 和 AI Studio 文件服务 / Veo 服务中断'],
        ['Interleaved text-and-image generation with Gemini 2.0 Flash', '使用 Gemini 2.0 Flash 进行图文交错生成。'],
        [' “A vintage-style poster advertising a local coffee.” ', ' “一则为本地咖啡馆宣传的复古风格海报。” '],
        ['. Do not submit personal, sensitive, or confidential information. ', '。请勿提交个人、敏感或机密信息。'],
        ['Add a negative prompt to define what should not be generated', '添加反向提示词，以排除不希望生成的内容'],
        ['Veo does not currently support uploading images with children.', 'Veo 目前不支持上传包含子元素的图片。'],
        ['(API pricing per 1M tokens, UI remains free of charge)', '（API 定价：每百万 Tokens，界面可免费使用）'],
        ['Are you sure you want to clear? This action cannot be undone.', '您确定要清除对话吗？该操作不能撤消。'],
        ['Chat with your chess pieces about strategy(or just banter).', '和你的棋子聊聊战术（或者只是互相吐槽）'],
        ['Immersive event landing page with interactive scroll effects.', '具有交互式滚动特效的沉浸式活动落地页'],
        ['Usage is reflective of all request types to the Gemini API.', '使用情况反映了Gemini API的所有请求类型'],
        [' “Create an image of a futuristic cityscape with...” ', ' “创建一张具有未来感的城市景观图片...” '],
        ['Failed to count tokens: permission denied. Please try again.', '计数 Tokens 失败：权限被拒绝，请重试'],
        [', and may be used to improve our services subject to our ', '，并可能根据我们的服务条款用于改进服务'],
        ['Choose a system instructions configuration to use with the applet', '选择一个系统指令配置用于小程序'],
        ['Peak usage per model compared to its limit over the last hour', '模型每小时最大使用量与其限制的对比'],
        ['Please tell us more about the reason for your feedback (optional)', '请详细说明您反馈的原因（选填）'],
        ['The fastest path from prompt to production with Gemini', '借助 Gemini，轻松实现从提示词到生产的飞跃'],
        ['A photorealistic long exposure photograph of a subway platform', '一张地铁站台的写实风格长曝光照片'],
        ['Interactively create, control, and perform music in the moment', '实时、交互地创作、控制和演奏音乐'],
        ['Peak usage per model compared to its limit over the last 1 day', '模型每天最大使用量与其限制的对比'],
        ['Peak usage per model compared to its limit over this month', '每个模型的峰值使用量与本月限制的对比'],
        ['Provide Gemini with functions it can use to create responses', '为 Gemini 提供可用于生成回复的函数'],
        ['Search for Cloud Project by Project Name or Project ID', '通过项目名称或项目 ID 搜索 Google 云项目'],
        [' “Create an image of rolling countryside landscape... ” ', '“创建一张连绵起伏的乡村风景图...”'],
        [' Content from previous turns is not referenced in new requests ', '新的请求中不引用之前的对话内容'],
        [' Points to gemini-2.5-flash-lite-preview-09-2025 ', ' 指向 gemini-2.5-flash-lite-preview-09-2025 '],
        [' “Create a close-up of a dew-covered spider web ...” ', '“创建一张挂满露珠的蜘蛛网的特写...”'],
        [' Our best video generation model, now with sound effects. ', '最先进的视频生成模型，现在支持音效'],
        ['Generate a high school revision guide on quantum computing', '生成一份关于量子计算的高中复习指南'],
        ['Insert assets such as images, folders, files, or audio', '插入资源，例如图像、文件夹、文件或音频'],
        ['Steer a continuous stream of music with text prompts', '通过文本提示词，实时控制生成的连续音乐流'],
        ['Throttling issues with Gemini 2.0 Flash have been resolved.', 'Gemini 2.0 Flash 的限流问题已解决'],
        ['You do not need to set an API key to use the free tier.', '您无需设置 API 密钥即可使用免费套餐。'],
        [' What terms apply to apps in the app gallery in AI Studio? ', 'AI Studio 应用库中应用的使用条款'],
        ['“Draw an intricate, picturesque pencil sketch of Du...”', '“画一幅精美、风景如画的铅笔素描”'],
        ['Create a live agent using bidirectional streaming', '使用双向流式传输技术，创建一个实时对话助手'],
        ["I'm breaking down your instructions into actionable steps", '我正在将您的指令分解为可操作的步骤'],
        ['The fastest way from prompt to production with Gemini', '使用 Gemini 实现从提示到生产的最快途径'],
        ['You need an active billing account to enable logging.', '您需要一个活动计费账户才能启用日志记录'],
        ['Create clips & animate images using generative video', '使用生成式视频创建短片并为图片制作动画'],
        ['Detected an issue with video processing in AI Studio.', '检测到 AI Studio 中的视频处理存在问题'],
        ['Logs containing videos or PDFs are currently not supported.', '包含视频或 PDF 的日志目前不支持'],
        ['No apps created yet. Build your first app now.', '尚未创建任何应用。立即创建您的第一个应用吧！'],
        ['The entire contents of your chat history with the Code Assistant', '您与代码助手的完整聊天记录'],
        ['The model will be used by the code assistant to generate code.', '代码助手将使用此模型生成代码'],
        ['This tool is not compatible with the current active tools.', '此工具与当前已启用的工具不兼容。'],
        ['You can change the display name and description of your app.', '您可以更改应用的显示名称和描述'],
        ['“Generate a sequence of images to produce a step...”', '“生成一系列图片，用于制作分步...”'],
        ['Live mix musical prompts with a MIDI controller', '使用 MIDI 控制器实时混合由提示词生成的音乐'],
        ['Navigate a complex 3d world with customizable interactions.', '使用可自定义交互的复杂 3D 世界'],
        ['The cause of the issue was identified as a configuration problem.', '问题原因已确定为配置问题'],
        [' How can I access the microphone, webcam, and other ', ' 我如何访问麦克风、网络摄像头和其他 '],
        ['Make changes, add new features, ask for anything', '您可以进行修改、添加新功能或提出任何要求'],
        ['The following settings are available for your code editor.', '以下是您的代码编辑器可用的设置'],
        ['Throttling issues with Gemini 1.5 Pro have been resolved.', 'Gemini 1.5 Pro 的限流问题已解决'],
        ['Try native image model effects with your webcam.', '通过您的网络摄像头尝试原生图像模型效果。'],
        ['AI Studio Realtime and Gemini Live API outage.', 'AI Studio 实时和 Gemini Live API 服务中断'],
        ['Explore the Veo 3 gallery and remix an example', '浏览 Veo 3 案例库，并选择一个进行二次创作'],
        ['Files over 1MB are not included in the code.', '大于 1MB 的文件内容不会被包含到应用代码中。'],
        ['Low latency, high volume tasks which require thinking', '需要复杂推理的低延迟、高吞吐量任务'],
        ['We are working to resolve the issues as quickly as possible', '我们正在努力尽快解决这些问题'],
        ['Add new features or easily modify this app with a prompt', '添加新功能或轻松修改此应用程序'],
        ['Extract price from a string and format it as JSON', '从字符串中提取价格，并格式化为 JSON。'],
        ['Toggle thinking budget between auto and manual', '在自动和手动模式间切换模型的“思考预算”'],
        ['Can I use Next.js, Svelte, Vue or Astro?', '我可以使用 Next.js、Svelte、Vue 或 Astro 吗？'],
        ['Create an app with Gemini 3 Pro Image Preview', '使用 Gemini 3 Pro Image Preview 创建应用'],
        ['Experience the multimodal model from Google DeepMind', '体验 Google DeepMind 的多模态模型'],
        ['The issue affecting Gemini 2.5 Pro has been resolved.', '影响 Gemini 2.5 Pro 的问题已解决'],
        ['Always show regardless of probability of being harmful', '一律显示（不过滤潜在有害内容）'],
        ['Explain the probability of rolling two dice and getting 7', '解释掷两个骰子得到 7 的概率'],
        ['Explore multimodal native image generation and editing', '探索多模态图像的生成和编辑功能'],
        ['Gemini 2.0 Flash and 1.5 Pro Throttling Incident', 'Gemini 2.0 Flash 和 1.5 Pro 限流事件'],
        ['If this happens again, report it by sending feedback', '如果再次发生，请通过发送反馈报告'],
        ['Imagen makes mistakes, so double-check it', 'Imagen 生成的内容可能存在错误，请仔细核对。'],
        ['Link a paid API key to access Nano Banana Pro', '链接付费 API 密钥以访问 Nano Banana Pro'],
        ['Prompt Gemini in this simple example', '通过这个简单的示例，学习如何向 Gemini 发出提示词'],
        ['The number of free generations that are remaining for this model', '此模型的免费生成次数'],
        ['Top P set of tokens to consider during generation.', 'Top-P 采样：控制生成文本的多样性。'],
        [' Points to gemini-2.5-flash-preview-09-2025 ', ' 指向 gemini-2.5-flash-preview-09-2025 '],
        ['Block low, medium and high probability of being harmful', '屏蔽低、中、高风险的有害内容'],
        ['Let Gemini execute Python code in a sandbox', '允许 Gemini 在沙盒环境中执行 Python 代码'],
        ['Quickly batch test prompts with visual outputs.', '快速批量测试提示词并查看可视化输出。'],
        ['Enable sticky scroll to show the nested code blocks.', '启用粘性滚动以显示嵌套的代码块'],
        ['Erroneous charges have been reported for some users.', '据报告，部分用户出现了错误收费'],
        ['Generate high-quality text-to-speech with Gemini', '使用 Gemini 生成高质量的文本转语音'],
        ['Generate Python code for a simple calculator app', '为简单的计算器应用生成 Python 代码'],
        ['Type something or tab to choose an example prompt', '输入内容或按 Tab 键选择示例提示词'],
        ['Use Imagen to generate images from a text prompt', '使用 Imagen 通过文本提示词生成图像'],
        ['You have unsaved changes. Do you want to save first?', '您有未保存的更改。要先保存吗？'],
        [' Issue has been detected. Investigation is underway. ', '已检测到问题，正在进行调查。'],
        ['A fix was implemented to address the configuration issue.', '已实施修复以解决配置问题'],
        ['Google AI Studio and the Gemini API Status', 'Google AI Studio 和 Gemini API 运行状态'],
        ['Search a custom set of images using natural language.', '使用自然语言搜索自定义图集。'],
        ['Select the audio source for the speech-to-text feature.', '选择语音转文本功能的音频源'],
        ['Start writing or paste text here to generate speech', '在此处输入或粘贴文本以生成语音'],
        ['Usage data may take up to 15 minutes to update.', '使用数据的更新可能需要长达 15 分钟'],
        [' How can I manage npm packages and their versions? ', ' 我如何管理 npm 包及其版本？ '],
        ['Create voxel art scenes inspired by any image.', '创作灵感源自任意图像的体素艺术场景'],
        ['Generate high quality text to speech with Gemini', '使用 Gemini 生成高质量文本到语音'],
        ['Intermittent unavailability of Gemini API 2.5 Pro', 'Gemini API 2.5 Pro 间歇性不可用'],
        ['Issue has been detected. Mitigations are underway.', '已检测到问题，正在采取缓解措施'],
        ['Large scale processing (e.g. multiple pdfs)', '大规模处理（例如，处理多个 PDF 文件）'],
        ['Optional tone and style instructions for the model', '为模型提供可选的语气和风格指令'],
        ['Select the audio source for the speech-to-text feature', '选择语音转文本功能的音频源'],
        ['Stream responses containing both images and text', '流式传输包含图片和文本的回复内容'],
        [' Gemini 3: Our most intelligent model to date. ', 'Gemini 3：到目前为止最智能的模型'],
        [' Set up billing to enable Gemini API logging ', '设置计费以启用 Gemini API 日志记录'],
        ['Start using Live API in Google AI Studio', '开始在 Google AI Studio 中使用 Live API'],
        ['Select a key below to use with your applet', '选择一个密钥以与您的应用程序搭配使用'],
        ['Veo makes mistakes, so double-check it', 'Veo 生成的内容可能存在错误，请仔细核对。'],
        [' Add annotations to visually iterate on your app ', '添加注释以可视化迭代你的应用'],
        [' Start creating with media in Google AI Studio ', '使用 Google AI Studio 开始创建'],
        [' State-of-the-art image generation and editing model. ', ' 顶尖图像生成与编辑模型'],
        ['Convert unorganized text into structured tables', '将非结构化文本转换为结构化表格'],
        ['Count how many tokens are in a piece of text', '计算一段文本中有多少 Token (令牌)'],
        ['Design a REST API for a social media platform.', '为社交媒体平台设计一个 REST API'],
        ['Select an image or video to add to the prompt', '选择要添加到提示词中的图像或视频'],
        ['Tackle difficult code, math and STEM problems', '应对复杂的代码、数学和 STEM 难题'],
        ['There is no billing currently set up for this project', '当前没有为此项目设置账单'],
        ["What's wrong? How can the response be improved?", '回复内容有什么问题？如何改进？'],
        ['Gemini 1.5 Pro and Flash Throttling Incident', 'Gemini 1.5 Pro 和 Flash 限流事件'],
        ['Gemini 2.5 Pro is unavailable for some users.', '部分用户无法使用 Gemini 2.5 Pro'],
        ['Project name must be at least 4 characters long. ', '项目名称必须至少 4 个字符长'],
        ['Control real time music with a MIDI controller.', '使用 MIDI 控制器控制实时音乐'],
        ['Example of live agent with AI Action Engine', '使用 AI 行动引擎的实时智能体示例'],
        ['Is my API key exposed when sharing apps?', '共享应用时，我的 API 密钥会暴露吗？'],
        ['Select a Google Cloud project to proceed:', '选择一个 Google Cloud 项目来继续：'],
        ['Unable to disable thinking mode for this model.', '无法为此模型关闭“思考”模式'],
        ['Are you sure you want to delete this API key?', '你确定想要删掉该 API 密钥吗？'],
        ['Audio recording will be added to your prompt', '音频录音将被添加到您的提示词中'],
        ['Set the temperature of a room using function calls', '使用函数调用设置房间温度'],
        ['System instructions are not supported for this model', '系统介绍不支持这个模型'],
        [' Monitor usage and more in the Dashboard ', '在仪表板中监控使用情况及其他信息'],
        ['A vintage-style poster of a local coffee shop', '一张本地咖啡店的复古风格海报'],
        ['Append to prompt and run (Ctrl + Enter)', '将提示词追加并运行（Ctrl + Enter）'],
        ['Block medium or high probability of being harmful', '屏蔽中、高风险的有害内容'],
        ['Get recipe ideas based on an image of ingredients', '根据食材图片获取食谱创意'],
        ['Imagen makes mistakes, so double-check it.', 'Imagen 会出错，所以请仔细检查。'],
        ['The entire contents of all of the files of your app', '您应用中的所有文件内容'],
        [' Vibe code GenAI enabled apps in Build ', '在 Build 中体验生成式 AI 应用开发'],
        ['Access Gemini models with the OpenAI SDK', '使用 OpenAI SDK 访问 Gemini 模型'],
        ['Insert a text file to add it to your prompt.', '将文本文件添加至您的提示词中'],
        ['Render indentation guides for each line of code.', '为每行代码渲染缩进参考线'],
        ['The text wraps around the edges of the editor.', '文本将在编辑器边缘自动换行'],
        ['Use Gemini to read a disclaimer, really fast', '使用 Gemini 快速朗读免责声明'],
        ['“Angular is running in development mode.”', 'Angular 正在开发模式下运行。'],
        ['Can I run apps outside of AI Studio?', '我可以在 AI Studio 之外运行应用吗？'],
        ['Get Started with Gemini 2.5 Flash Image', '开始使用 Gemini 2.5 Flash Image '],
        ["This model doesn't support System Instructions.", '此模型不支持“系统指令”'],
        ['You can only add one image to the prompt.', '您只能向提示词中添加一张图片。'],
        ['Generate logo and swag ideas for a brand', '为品牌构思 Logo 和周边产品创意'],
        ['Loading your Google Cloud projects...', '正在加载您的 Google Cloud 项目...'],
        ['Optimized for fastest response and lowest cost', '优化为最快响应和最低成本'],
        ['Render the minimap with the file overview.', '渲染带有文件概览的代码缩略图'],
        ['Write a quantum computing guide for students', '为学生编写一份量子计算指南'],
        [' Gemini 3 Pro Image Preview is here ', 'Gemini 3 Pro Image Preview 在这里'],
        [' High-fidelity design with Nano Banana Pro ', 'Nano Banana Pro 高保真设计'],
        [' State-of-the-art image generation and editing ', '最先进的图像生成和编辑'],
        ['A high resolution image of a butterfly wing', '一张高分辨率的蝴蝶翅膀图片'],
        ['Extra text returned with Gemini 2.5 models', 'Gemini 2.5 模型返回额外文本'],
        ['AI Studio may not load for some users.', '部分用户可能无法加载 AI Studio'],
        ['Fetching prompt details. Please wait...', '正在获取提示词详情，请稍等...'],
        ['Include prompt history in generated code', '在生成的代码中包含提示词记录'],
        ['Sample from Imagen models to generate images', '调用 Imagen 模型生成图片'],
        ['Calculate text embeddings for use in RAG', '为 RAG 应用计算文本嵌入向量'],
        ['Control real time music with text prompts', '通过文本提示词控制实时音乐'],
        ["Define what you don't want to see", '描述您不希望在生成内容中看到的事物'],
        ['Enable folding to collapse code blocks.', '启用代码折叠功能以收起代码块'],
        ['Localized and personalized comic book generator', '本地化个性漫画生成器'],
        ['Screenshot will be added to your prompt', '屏幕截图将添加到您的提示词中'],
        ['Submit: Enter\nNewline: Shift + Enter', '提交：Enter\n换行：Shift + Enter'],
        ['The ratio of width to height of the generated image', '生成图片的宽高比'],
        [' Fetch real-time information from web links ', '从网页链接获取实时信息'],
        ['An image of a fictional soda advertisement', '一张虚构的苏打水广告图片'],
        ['Maximum number of tokens in response', '回复内容的最大 Token (令牌) 数'],
        ['Model selection is currently not available', '当前模型选择功能暂不可用'],
        ['Need some inspiration? See examples in', '需要灵感？不妨看看这里的示例'],
        ['Show conversation with markdown formatting', '以 Markdown 格式显示对话'],
        ['The output resolution of the generated media', '生成式媒体的输出分辨率'],
        ["This model doesn't support System instructions", '此模型不支持系统指令'],
        [' Gemini API and AI Studio outage ', 'Gemini API 和 AI Studio 服务中断'],
        ['Calculate and explain a probability problem', '计算并解释一个概率问题'],
        ['Gemini API Additional Terms of Service', '《Gemini API 附加服务条款》'],
        ['Generate images with Nano Banana Pro', '使用 Nano Banana Pro 生成图像'],
        ['Image to a JSON structured recipe', '将食材图片转换为 JSON 格式的食谱'],
        ['Insert an image to add it to your prompt.', '将图片添加至您的提示词中'],
        ['Show conversation without markdown formatting', '以纯文本格式显示对话'],
        ['Submit: Ctrl + Enter\nNewline: Enter', '提交：Ctrl + Enter\n换行：Enter'],
        ['Test if AI knows which number is bigger', '测试 AI 是否能判断数字大小'],
        [', so the API key is no longer exposed. ', '因此， API 密钥不再暴露。'],
        ['Ask questions about key details in a video', '就视频中的关键细节提问'],
        ['Dynamic text game using Gemini', '使用 Gemini 打造的动态文字冒险游戏'],
        ['Example chat app built with Gemini', '使用 Gemini 构建的聊天应用示例'],
        ['Failed to count tokens. Please try again.', 'Tokens 计数失败，请重试'],
        ['Failed to list models. Please try again.', '无法列出模型，请稍后重试'],
        ['Gemini API and AI Studio outage.', 'Gemini API 和 AI Studio 服务中断'],
        ['Ground responses with Google Search.', '基于 Google 搜索结果生成回复'],
        ['How can I use GitHub with my apps?', '我如何将 GitHub 用于我的应用？'],
        ['Insert images, videos, audio, or files', '插入图像、视频、音频或文件'],
        ['Intermittent unavailability of Gemini API', 'Gemini API 间歇性不可用'],
        ['Output format that the model should generate', '模型应生成的输出格式'],
        ['Peak input tokens per minute (TPM)', '每分钟最大输入 Tokens 量 (TPM)'],
        ['Remove prompt image from Drive', '从 Google 云端硬盘中删除提示词图片'],
        ['Render the line numbers for each line of code.', '为每行代码渲染行号'],
        ['Stop generation before creating a new chat', '在创建新对话前停止生成'],
        ['This model generates one image at a time', '此模型一次仅生成一张图片'],
        ['Video processing failures in AI Studio', 'AI Studio 中的视频处理失败'],
        [' Studio-quality image generation & editing ', '影棚级图像生成与精修'],
        [' to constrain the model output. See the ', ' 来约束模型输出。请参阅'],
        [' You can deploy your app to ', '您可以从 AI Studio 将您的应用部署到'],
        ['“Create a stylized 3D clay...”', '“创建一个风格化的 3D 粘土...”'],
        ['Are you sure you want to delete this app?', '您确定要删除此应用吗？'],
        ['Example Angular app using Gemini', '使用 Gemini 的 Angular 示例应用'],
        ['Gemini 2.5 Pro Unavailability Incident', 'Gemini 2.5 Pro 不可用事件'],
        ['Get SDK code to chat with Gemini', '获取 Gemini 聊天功能的 SDK 代码'],
        ['Select an image from Google Drive', '从 Google 云端硬盘选择一张图片'],
        ['Select an image from the sample gallery', '从示例图库中选择一张图片'],
        ['Select Cloud Project to use paid tier', '选择要用于付费服务的云项目'],
        ['Temporary chat is not available for Veo', '临时聊天功能不适用于 Veo'],
        ['What did you like about the response?', '你喜欢这个回复的哪些方面？'],
        [' Instructions are saved in local storage. ', '指令已保存到本地存储'],
        ['Add unit tests for a Python function', '为 Python 函数添加单元测试'],
        ['Command failed due to an internal error.', '命令由于内部错误而失败'],
        ['Failed to list projects. Please try again.', '列出项目失败，请重试'],
        ['Remove app from recent apps list', '从“最近使用”列表中移除此应用'],
        ['Sample from Veo models to generate videos', '调用 Veo 模型生成视频'],
        ['Select an image to add to the prompt', '选择一张图片添加到提示词中'],
        ['before using the code in your project', '在您的项目中使用此代码前'],
        ['Gemini 2.0 Flash Throttling Incident', 'Gemini 2.0 Flash 限流事件'],
        ['Gemini intelligence in your app', '在您的应用中使用 Gemini 智能体'],
        ['Generate a confusion matrix in Python', '使用 Python 生成混淆矩阵'],
        [' aka Gemini 2.5 Flash Image ', '也称为 Gemini 2.5 Flash 图像模型'],
        [' Default (Gemini 3 Pro Preview) ', '默认（Gemini 3 Pro Preview）'],
        [' Fast image generation with Nano Banana ', 'Nano Banana 闪电生图'],
        [' Generate native speech with Gemini ', '使用 Gemini 生成原生语音'],
        [' Turn text into audio with Gemini ', '使用 Gemini 转换文本为音频'],
        ['Design a social media platform API', '设计一个社交媒体平台的 API'],
        ['Get SDK code to generate an image', '获取用于生成图片的 SDK 代码'],
        ['Video will be added to your prompt', '视频将被添加到您的提示词中'],
        ['Voice used to generate audio output.', '用于生成音频输出的音色。'],
        [' Fetch information with URL context ', '使用 URL 上下文获取信息'],
        [' File API document processing outage. ', '文件 API 文档处理中断'],
        [' Gemini powered code review tool ', '基于 Gemini 的代码审核工具'],
        [' Our most intelligent model to date. ', '到目前为止最智能的模型'],
        ['(Recommended) Maximizes reasoning depth', '（推荐）最大推理深度'],
        ['Block high probability of being harmful', '屏蔽高风险的有害内容'],
        ['Example React app using Gemini', '使用 Gemini 的 React 应用示例'],
        ['List of models available in the system.', '系统中可用模型的列表'],
        [' if you have anything specific in mind. ', '如果您有具体的想法'],
        [' Text to speech with Gemini ', '使用 Gemini 进行文本到语音转换'],
        ['Clear the chat to start a new stream', '清除聊天记录开始新对话'],
        ['Enable or disable thinking for responses', '启用或禁用思考模式'],
        ['Photo will be added to your prompt', '照片将添加到您的提示词中'],
        ['Solve different quadratic equations.', '解不同的一元二次方程。'],
        ['Status | Google AI Studio', '站点状态 | Google AI 开发者工作台'],
        [' Restore app to previous version ', '恢复应用程序到上一个版本'],
        ['Craft a blog post with an image', '撰写一篇图文并茂的博客文章'],
        ['Gemini 1.5 Pro Throttling Incident', 'Gemini 1.5 Pro 限流事件'],
        ['handles versioning and dependencies', '处理版本控制和依赖关系'],
        ['No Google Cloud projects found.', '未找到 Google Cloud 项目。'],
        ['Stream images and video in realtime', '实时流式传输图片和视频'],
        ['Supercharge your apps with AI', '用 AI 为您的应用注入强大动力'],
        [' “Create a vintage movie ... ” ', '“创建一个复古电影...”'],
        [' AI Studio Code Assistant outage. ', 'AI Studio 代码助手中断'],
        ['Copyright acknowledgement dialog image', '版权确认对话框图像'],
        ['Create a Python calculator app', '创建一个 Python 计算器应用'],
        ['Get Started with the Gemini JS SDK', 'Gemini JS SDK 入门指南'],
        ['Grounding with Google Search', '基于 Google 搜索结果生成内容'],
        ['Identify elements in a hurricane chart', '识别飓风图中的元素'],
        ['Render the text with font ligatures.', '使用字体连字渲染文本'],
        ['Show the thinking process of the model', '显示模型的思考过程'],
        ['Sync system instructions on both sides', '同步双方的系统指令'],
        [' Failed to upload file to Drive. ', '上传文件到云端硬盘失败'],
        [' Recipe generator using Gemini ', '使用 Gemini 的食谱生成器'],
        ["Can't find your API keys here?", '这里没有您的 API 密钥吗？'],
        ['Cannot be empty or contain only spaces.', '内容不能为空白。'],
        ['Find the next shape in a sequence', '找出序列中的下一个形状'],
        ['Get SDK code to generate a video', '获取生成视频的 SDK 代码'],
        ['Identify and care for your plants', '识别植物并提供养护建议'],
        ['Select the model for the code assistant', '选择代码助手模型'],
        ['Solve geometry problems with an image', '通过图片解答几何题'],
        ['Sort Special Characters and Brackets.', '排序特殊字符和括号'],
        [' “Create a Macro photog... ” ', '“创建一张微距摄影...”'],
        [' Chat with models in the Playground ', '在平台中与模型聊天'],
        ['Call tools natively, like Search', '原生调用“搜索”等工具'],
        ['Create regex from text input', '根据文本输入创建正则表达式'],
        ['Design a custom birthday card.', '设计一张定制的生日贺卡。'],
        ['Enter a prompt to generate a video', '输入提示词以生成视频'],
        ['Expand or collapse advanced settings', '展开或收起高级设置'],
        ['Generate interleaved text and images', '生成图文交错的内容'],
        ['Get SDK code to generate speech', '获取生成语音的 SDK 代码'],
        ['LearnLM 2.0 Flash Experimental', 'LearnLM 2.0 Flash 实验版'],
        ['Native Audio Function Call Sandbox', '原生音频函数调用沙盒'],
        ['No prompts match your search', '没有与您的搜索相匹配的对话'],
        ['Our current state of the art model', '我们当前的最先进模型'],
        ['Peak requests per minute (RPM)', '每分钟最大请求次数 (RPM)'],
        ['Select model for the code assistant:', '选择代码助手模型：'],
        ['What is Build in AI Studio?', '在 AI Studio 中能构建什么？'],
        [' Build apps with AI video ', '在 AI Studio 中构建视频应用'],
        [' Gemini API Logs and Datasets ', 'Gemini API 日志和数据集'],
        [' Projects you may want to import ', '您可能想要导入的项目'],
        [' Sign in to GitHub to continue ', '继续登录 GitHub 以继续'],
        ['An image of a San Francisco stamp', '一张旧金山邮票的图片'],
        ['Expand to view model thoughts', '展开以查看模型的思考过程'],
        ['Press space for more information.', '按下空格查看更多信息'],
        ['Switch to API Key for your app', '切换到你的应用 API 密钥'],
        ['Your conversation won’t be saved', '你的对话将不会被保存'],
        [' Build with the Gemini API  ', '使用 Gemini API 进行构建'],
        ['Adjust harmful response settings', '调整有害内容过滤设置'],
        ['AI Studio Drive Link Issue', 'AI Studio 云端硬盘链接问题'],
        ['API pricing per 1M tokens.', '每个 1M Tokens 的 API 费用'],
        ['Aspect ratio of the generated images', '生成图像的宽高比'],
        ['Build your ideas with Gemini', '使用 Gemini 构建您的创意'],
        ['Deploy app on Google Cloud', '在 Google Cloud 上部署应用'],
        ['Expand or collapse navigation menu', '展开或收起导航菜单'],
        ['Fetch information from web links', '从网页链接中获取信息'],
        ['File upload failed: undefined ', '文件上传失败：未知错误'],
        ['Image (*Output per image)', '图片（*每张图片的输出成本）'],
        ['Make a new copy in Drive', '在 Google 云端硬盘中创建副本'],
        ['Send prompt (Ctrl + Enter)', '发送提示词（Ctrl + Enter）'],
        ['Start typing dialog here...', '在此处开始输入对话内容...'],
        ['Summarizing image and text content', '总结图片和文本内容'],
        [' Unsupported file type selected. ', '不支持所选文件类型'],
        ['30 RPM 14400 req/day', '每分钟 30 次请求，每天 14400 次'],
        ['Are you sure you want to clear?', '你确定要清空对话吗？'],
        ['Create a custom birthday card', '制作一张定制的生日贺卡'],
        ['Enter a prompt to generate an app', '输入提示词生成应用'],
        ['Find and update time complexity', '分析并优化时间复杂度'],
        ['moving some logic server-side', '将部分逻辑移至服务器端'],
        ['Restore code from this checkpoint', '从此检查点恢复代码'],
        ['Run prompt (Ctrl + Enter)', '运行提示词（Ctrl + Enter）'],
        ['Save the prompt before sharing it', '分享前请先保存对话'],
        ['Start Time (e.g., 1m10s)', '开始时间 (例如，1 分 10 秒)'],
        ['Summarizing text research content', '总结研究性文本内容'],
        [' Nano banana image generation ', 'Nano Banana 影像创作'],
        [' Verify AI generated content with ', '验证 AI 生成内容'],
        [' YouTube url handling outage. ', 'YouTube URL 处理中断'],
        [', by running the following code:', '，请运行以下代码：'],
        ['Agree to the copyright acknowledgement', '同意版权确认'],
        ["Can't find your projects here?", '这里没有您的项目吗？'],
        ['Create conversational voice apps', '创建对话式语音应用'],
        ['Gemini Batch API outages.', 'Gemini Batch API 服务中断'],
        ['Gemini powered code review', '由 Gemini 赋能的代码审核'],
        ['Learn more about Gemini models', '详细了解 Gemini 模型'],
        ['Nano banana powered app', '基于 Nano Banana 强大的应用'],
        ['Resolution of the generated images', '生成图像的分辨率'],
        ['Search Google Cloud projects', '搜索 Google Cloud 项目'],
        ['Total API Requests per minute', '每分钟总 API 请求次数'],
        [' Immersive Games & 3D Worlds ', '沉浸式游戏与 3D 视界'],
        [' Nano Banana Pro outage. ', 'Nano Banana Pro 服务中断'],
        ['10 RPM 1500 req/day', '每分钟 10 次请求，每天 1500 次'],
        ['15 RPM 1500 req/day', '每分钟 15 次请求，每天 1500 次'],
        ['30 RPM 1500 req/day', '每分钟 30 次请求，每天 1500 次'],
        ['Choose Google Cloud project', '选择 Google Cloud 项目'],
        ['Collapse to hide model thoughts', '收起模型的思考过程'],
        ['Image of a futuristic cityscape', '未来城市景观的图片'],
        ['Image of an afternoon tea table', '一张下午茶桌的图片'],
        ['Model used to generate response', '用于生成回复的模型'],
        ['No recording devices available.', '没有可用的录制设备'],
        ['Peak requests per day (RPD)', '每天最大请求次数 (RPD)'],
        ['Your response is Feedback under the', '您的反馈将遵循'],
        ['Add an image to the prompt', '向提示词中添加一张图片'],
        ['Analyze the sentiment of texts', '分析文本的情感倾向'],
        ['End Time (e.g., 2m30s)', '结束时间(例如，2 分 30 秒)'],
        ['Get Started with Nano Banana', 'Nano Banana 新手入门'],
        ['Imagen Requests per minute', '每分钟 Imagen 请求次数'],
        ['No issues recorded on this day', '今天没有记录的问题'],
        ['Total API Errors per minute', '每分钟总 API 错误次数'],
        ['Total API Requests per hour', '每小时总 API 请求次数'],
        ['Write a Docker set up script', '编写 Docker 设置脚本'],
        [' Gemini 3 Flash is here ', 'Gemini 3 Flash 震撼登场'],
        [' Music generation with Lyria ', 'Lyria 律雅灵感编曲'],
        [' This action cannot be undone. ', '此操作无法撤销。'],
        ['15 RPM 500 req/day', '每分钟 15 次请求，每天 500 次'],
        ['An internal error has occurred.', '系统发生内部错误'],
        ['Edit app name and description', '编辑应用名称和描述'],
        ['Failed to load history list', '加载历史记录列表失败'],
        ['Gemini API Usage & Billing', 'Gemini API 用量和结算'],
        ['Generate images with Imagen', '使用 Imagen 生成图片'],
        ['No changes to add to chat', '没有可添加到聊天的更改'],
        ['Number of images to be returned', '要生成的图片数量'],
        ['Number of videos to be returned', '要生成的视频数量'],
        ['Prompt based video generation', '基于提示词生成视频'],
        ['Take a photo with your camera', '使用您的摄像头拍照'],
        ['Total API Requests per day', '每天的总 API 请求次数'],
        [' Knowledge cut off: Unknown ', '知识截止日期：未知'],
        [' Monitor usage and projects ', '监控使用情况和项目'],
        ['Animate images with Veo', '使用 Veo 为图像添加动画'],
        ['Chat | Google AI Studio', '聊天 | Google AI Studio'],
        ['Discover and remix app ideas', '发现并修改应用创意'],
        ['Exporting image to Drive', '正在导出图像到云端硬盘'],
        ['Gemini API Additional Terms', 'Gemini API 附加条款'],
        ['Generate a story with images', '生成图文并茂的故事'],
        ['Generative Language API Key', '生成式语言 API 密钥'],
        ['Imagen Requests per hour', '每小时 Imagen 请求次数'],
        ['Link a paid API key here.', '在此链接付费 API 密钥'],
        ['Look up API Key for project', '查找项目的 API 密钥'],
        ['Process 10,000 lines of code', '处理 10,000 行代码'],
        ['Reason over complex problems', '对复杂问题进行推理'],
        ['Run code changes automatically', '自动运行代码变更'],
        ['See changes in version history', '查看版本历史记录'],
        ['Total API Errors per hour', '每小时总 API 错误次数'],
        [' Explore Nano Banana Pro ', '探索 Nano Banana Pro'],
        [' Write my own instructions ', ' 编写我个人的说明 '],
        ['Excitable, Lower middle pitch', '易激动，中低音调'],
        ['Imagen pixel art maker', 'Imagen 像素风艺术生成器'],
        ['Knowledgeable, Middle pitch', '知识渊博，中等音调'],
        ['Restore app to this version', '将应用恢复到此版本'],
        ['Run the app (Ctrl+Enter)', '运行应用 (Ctrl+Enter)'],
        [' Vibe code GenAI apps ', '氛围编程生成式 AI 应用'],
        ['Copy prompt to clipboard', '将提示词复制到剪贴板'],
        ['Create custom product images', '创建自定义产品图'],
        ['Easy-going, Lower middle pitch', '随和，中低音调'],
        ['Image of a house in a forest', '森林中房子的图片'],
        ['Informative, Lower pitch', '信息丰富的，较低音调'],
        ['Input Tokens per minute', '每分钟输入 Token 次数'],
        ['Open in new window', '在新窗口中打开（进入凭证）'],
        ['Robotics Spatial Understanding', '机器人空间理解'],
        ['Select a Cloud Project', '选择一个 Google 云项目'],
        ['You can run this prompt from the', '您可以运行从'],
        [' Lightning fast generation ', '闪电般的生成速度'],
        [' Upload an instructions file ', ' 上传说明文件 '],
        ['? This cannot be undone. ', '? 该操作不可撤销。'],
        ['“name” must be specified', '“name” 必须指定'],
        ['Are you sure you want to delete', '你确定要删除'],
        ['Function Call Kitchen', 'Function Call 智能厨房'],
        ['Gemini 2.5 Flash Audio', 'Gemini 2.5 Flash 音频'],
        ['Icon For Translation Efficiency', '翻译效率图标'],
        ['Imagen Requests per day', '每天 Imagen 请求次数'],
        ['Informative, Middle pitch', '信息丰富，中等音调'],
        ['Input Token Count per Day', '每日输入 Tokens 量'],
        ['Multi-modal generative models', '多模态生成模型'],
        ['No Cloud Projects Available', '没有可用的云项目'],
        ['Robotics visual understanding', '机器人视觉理解'],
        ['Scroll to previous prompt', '滚动到上一条提示词'],
        ['Time to first token: ', '首个 Tokens 响应时间：'],
        ['Total API Errors per day', '每天的 API 错误总数'],
        ['Use Gemini to greet you', '使用 Gemini 向您问好'],
        [' Connecting to server... ', '正在连接服务器...'],
        [' No access to Drive ', '没有访问云端硬盘的权限'],
        [' Try Nano Banana ', '尝试 Nano Banana 图像模型'],
        ['A knit countryside image', '一张针织乡村风景图'],
        ['Add items to file explorer', '添加文件到管理器'],
        ['Build apps with Gemini', '使用 Gemini 构建应用'],
        ['Collapse prompts history', '收起提示词历史记录'],
        ['Copied link to clipboard', '已复制链接到剪贴板'],
        ['Filter the list of my apps', '过滤我的应用列表'],
        ['Friendly, Lower middle pitch', '友好的，中低音'],
        ['Input Tokens per day', '每天的输入 Tokens 次数'],
        ['Input Tokens per hour', '每小时输入 Token 次数'],
        ['Input/Output API Pricing', '输入/输出 API 定价'],
        ['No apps match the filter', '没有应用与搜索匹配'],
        ['Only one option is supported', '仅支持一个选项'],
        ['Product Mockup Visualization', '产品样机可视化'],
        ['Use Google Search data', '使用 Google 搜索数据'],
        ['Veo Requests per minute', '每分钟 Veo 请求次数'],
        [' Gemini 3 Pro is here ', 'Gemini 3 Pro 在这里'],
        [' Try Nano Banana Pro ', '尝试 Nano Banana Pro'],
        ['All Systems Operational', '所有系统均正常运行'],
        ['Control image aspect ratios', '控制图像纵横比'],
        ['Generate structured outputs', '生成结构化输出'],
        ['Generate videos with Veo', '使用 Veo 生成视频'],
        ['Loading your API keys', '加载您的 API 密钥...'],
        ['OpenAI SDK compatibility', 'OpenAI SDK 兼容性'],
        ['Use Google AI Studio', '使用 Google AI Studio'],
        [' Choose a paid API key ', '选择付费 API 密钥'],
        ['Bring Any Idea to Life', '将任何创意带到生活'],
        ['Casual, Lower middle pitch', '随意的，中低音'],
        ['Choose an imported project', '选择导入的项目'],
        ['Close run settings panel', '关闭运行设置面板'],
        ['Delete system instruction?', '删除系统指令？'],
        ['Easy-going, Middle pitch', '随和的，中等音调'],
        ['Edit title and description', '编辑标题和描述'],
        ['Expand prompts history', '展开提示词历史记录'],
        ['Gemini API Rate Limit', 'Gemini API 速率限制'],
        ['Image of fuzzy bunnies', '毛茸茸的兔子的图片'],
        ['Plot a trigonometric graph', '绘制三角函数图'],
        ['System instruction deleted', '系统指令已删除'],
        ['System instructions template', '系统指令模板'],
        ['Use Google Maps data', '使用 Google 地图数据'],
        ['Veo Requests per hour', '每小时 Veo 请求次数'],
        ['Visual and text processing', '视觉和文本处理'],
        [' Beautiful landing pages ', '绝美落地页展示'],
        [' Developer quickstarts ', '开发人员快速入门'],
        [' Prohibited Use Policy ', '《禁止使用政策》'],
        [' Try Gemini 3 Flash ', '体验 Gemini 3 Flash'],
        ['Add to existing dataset', '添加到现有数据集'],
        ['Augmented Image', 'Augmented Image 影像注智'],
        ['Automatic Function Response', '自动函数响应'],
        ['Clear, Lower middle pitch', '清晰的，中低音'],
        ['create an API key.', '请创建一个 API 密钥。'],
        ['Create your first app', '创建您的第一个应用'],
        ['Delete function declaration', '删除函数声明'],
        ['Do not run safety filters', '禁用安全过滤器'],
        ['Gemini speech generation', 'Gemini 语音生成'],
        ['Image of sushi on a table', '桌上寿司的图片'],
        ['Mark property as optional', '标记属性为可选'],
        ['Render indentation guides', '渲染缩进参考线'],
        ['Scroll to next prompt', '滚动到下一条提示词'],
        ['Thanks for your feedback!', '感谢您的反馈！'],
        [' are a subset of the standard ', ' 是标准 '],
        [' Create with Veo 3.1 ', '使用 Veo 3.1 创建'],
        [' Games and Visualizations ', '游戏和可视化'],
        ['Advanced share permissions', '高级共享权限'],
        ['Aspect ratio of the videos', '视频的宽高比'],
        ['Breathy, Lower pitch', '气息感的，较低音调'],
        ['Checking for API keys', '正在检查 API 密钥'],
        ['Edit function declarations', '编辑函数声明'],
        ['Even, Lower middle pitch', '平稳的，中低音'],
        ['Expand or collapse tools', '展开或收起工具'],
        ['Firm, Lower middle pitch', '坚定的，中低音'],
        ['FPS (frames per second)', 'FPS（每秒帧数）'],
        ['Gemini image generation', 'Gemini 图像生成'],
        ['Get started with Gemini', '开始使用 Gemini'],
        ['Google AI Studio', 'Google AI 开发者工作台'],
        ['Ignoring specified model', '忽略指定的模型'],
        ['Live audio-to-audio dialog', '实时音频对话'],
        ['policy-controlled features', '策略控制功能'],
        ['See original conversations', '查看原始对话'],
        ['Send a file to the model', '向模型上传文件'],
        ['The issue has been resolved.', '问题已解决'],
        ['Who can see my apps?', '谁能看到我的应用？'],
        ['Youthful, Higher pitch', '年轻的，较高音调'],
        [' Google Cloud Console ', 'Google 云控制台'],
        ['A sci-fi movie poster', '一张科幻电影海报'],
        ['An unknown error occurred', '发生未知错误'],
        ['Code Assistant messages', '代码助手的消息'],
        ['Combine images of flowers', '组合花卉图像'],
        ['Create generative media', '创建生成式媒体'],
        ['Create Generative Media', '创建生成式媒体'],
        ['Delete system instruction', '删除系统指令'],
        ['Forward, Middle pitch', '有力的，中等音调'],
        ['Gemini API Billing', 'Gemini API 计费账单'],
        ['Gemma Terms of Use', '《 Gemma 使用条款》'],
        ['Google Search Suggestions', '谷歌搜索建议'],
        ['Gravelly, Lower pitch', '沙哑的，较低音调'],
        ['Guessing Game', 'Guessing Game 猜猜大作战'],
        ['Maximum output tokens', '最大输出Tokens数'],
        ['OpenAPI schema object', 'OpenAPI 架构对象'],
        ['See details on our ', '查看我们的详细信息'],
        ['See original conversation', '查看原始对话'],
        ['Select media resolution', '选择媒体分辨率'],
        ['Select or upload a file', '选择或上传文件'],
        ['SpinnerEvolve', 'SpinnerEvolve 加载进化论'],
        ['Talk to Gemini live', '与 Gemini 实时交谈'],
        ['Veo Requests per day', '每天 Veo 请求次数'],
        [' Allow Drive access ', '允许访问云端硬盘'],
        [' Explore Past Forward ', '探索过去到未来'],
        [' file. For example, ', ' 文件中。例如， '],
        ['+ Create new instruction', '+ 创建新指令'],
        ['503 ServiceUnavailable', '503 服务不可用'],
        ['Add function declaration', '添加函数声明'],
        ['Analyze a research paper', '分析研究论文'],
        ['Breezy, Middle pitch', '轻松的，中等音调'],
        ['Bright, Higher pitch', '明亮的，较高音调'],
        ['Bright, Middle pitch', '明亮的，中等音调'],
        ['Create a scavenger hunt.', '创建寻宝游戏'],
        ['Create your API key', '创建您的 API 密钥'],
        ['Error loading apps', '加载应用程序时出错'],
        ['Gentle, Middle pitch', '温柔的，中等音调'],
        ['Make property an array', '将属性设为数组'],
        ['Mature, Middle pitch', '成熟的，中等音调'],
        ['Native speech generation', '原生语音生成'],
        ['Not following instructions', '未遵循指示'],
        ['Open in Vertex AI', '在 Vertex AI 中打开'],
        ['Reload recent apps', '重新加载最近的应用'],
        ['Resolution of the videos', '视频的分辨率'],
        ['Session is in progress', '会话正在进行中'],
        ['Smooth, Middle pitch', '平滑的，中等音调'],
        ['Upbeat, Higher pitch', '欢快的，较高音调'],
        ['Upbeat, Middle pitch', '欢快的，中等音调'],
        ['We have updated our ', '我们已更新我们的'],
        [' Submit prompt key ', '快捷键提交提示词'],
        [' Try Gemini 3 Pro ', '体验 Gemini 3 Pro'],
        ['Action Replay', 'Action Replay 极速回放'],
        ['Already in a new chat', '当前已是新会话'],
        ['Clear, Middle pitch', '清晰的，中等音调'],
        ['Data Resolver', 'Data Resolver 数据透镜'],
        ['Deleting prompt...', '正在删除提示词...'],
        ['Deploy to Cloud Run', '部署到 Cloud Run'],
        ['Description of the function', '函数描述'],
        ['Here are the changes:', '更改内容如下：'],
        ['Lively, Lower pitch', '活泼的，较低音调'],
        ['Native image generation', '原生图像生成'],
        ['No changes to clear', '没有可清除的更改'],
        ['No Usage Data Available', '暂无使用数据'],
        ['Rate limits breakdown', '按速率限制细则'],
        ['Rate limits by model ', '按模型速率限制'],
        ['Run settings - Right', '运行设置 - 右侧'],
        ['Scalable Vector Grill', 'SVG 矢量烧烤摊'],
        ['Session page navigation', '会话页面导航'],
        ['Smooth, Lower pitch', '平滑的，较低音调'],
        ['Start typing a prompt', '开始输入提示词'],
        ['Tokens per second: ', '每秒 Tokens 数：'],
        ['Video to Learning App', '视频转学习应用'],
        [' Create new instruction ', '创建新指令'],
        [' Search your projects ', '搜索您的项目'],
        [' View all history ', '查看所有历史记录'],
        ['A banyan tree building', '一座榕树建筑'],
        ['AI powered chatbot', '基于 AI 的智能体'],
        ['Browse the url context', '浏览网页内容'],
        ['Change All Occurrences', '更改所有出现'],
        ['Close file tree view', '关闭文件树视图'],
        ['Collapse all folders', '折叠所有文件夹'],
        ['Copied to clipboard.', '已复制到剪贴板'],
        ['Delete API key?', '确认删除 API 密钥？'],
        ['developer guide docs', '开发者指南文档'],
        ['Do you want to continue?', '是否继续？'],
        ['Filter by time range', '按时间范围过滤'],
        ['Firm, Middle pitch', '坚定的，中等音调'],
        ['Frame rate of the videos', '视频的帧率'],
        ['Harmful or offensive', '有害或令人反感'],
        ['Issue has been resolved.', '问题已解决'],
        ['Maps Grounding', '地图溯源 (Grounding)'],
        ['Multimodal understanding', '多模态理解'],
        ['No changes to save', '没有要保存的更改'],
        ['No changes to undo', '没有可撤销的更改'],
        ['Or try some examples', '或尝试一些示例'],
        ['Proactive Co-Creator', '主动式共创伙伴'],
        ['Prompt suggestion card', '提示建议卡片'],
        ['Reset default settings', '重置默认设置'],
        ['Run settings - Left', '运行设置 - 左侧'],
        ['Select the model voice', '选择模型音色'],
        ['Set the thinking level', '设置思考等级'],
        ['Sharing prompt...', '正在分享提示词...'],
        ['Skip to main content', '跳转到主要内容'],
        ['Soft, Higher pitch', '柔和的，较高音调'],
        ['Start stream to record', '开始对话录制'],
        ['Think more when needed', '深入思考更多'],
        ['Toggle navigation menu', '切换导航菜单'],
        ['Try an example app', '尝试一个示例应用'],
        ['View older generations', '查看历史记录'],
        ['Warm, Middle pitch', '温暖的，中等音调'],
        [' Conversational agents ', '智能对话体'],
        [' Created by others ', '由其他用户创建'],
        [' Current screen size ', '当前屏幕大小'],
        [' Go to Projects Page ', '前往项目页面'],
        [', after installing the ', '，安装之后'],
        ['All context lengths', '所有上下文长度'],
        ['Audio voice assistant', '音频语音助手'],
        ['Collapse code snippet', '折叠代码片段'],
        ['Copied to clipboard', '已复制到剪贴板'],
        ['Default to fullscreen', '默认全屏显示'],
        ['Delete speaker dialog', '删除此段发言'],
        ['from AI Studio', '在 AI Studio 中运行'],
        ['Gemini Slingshot', 'Gemini 弹弓大作战'],
        ['Multimodal Live API', '多模态实时 API'],
        ['Output token cost:', '输出 Token 成本'],
        ['Request Count per Day', '每天请求计数'],
        ['Requests per minute', '每分钟请求次数'],
        ['Select device preview', '选择设备预览'],
        ['Show file tree view', '显示文件树视图'],
        ['Target context size', '目标上下文大小'],
        ['Total API Requests', '总 API 请求次数'],
        ['Use Google Search', '使用 Google 搜索'],
        [' Create a new project ', '创建新项目'],
        [' Internet favorites ', '全网人气精选'],
        [' Monitor API usage ', '监控 API 使用'],
        [' Supported values for ', ' 支持的值 '],
        [' Understanding projects ', '了解项目'],
        ['Answer took too long', '响应时间过长'],
        ['Audio-Video Generation', '音视频生成'],
        ['Browse the app gallery', '浏览应用库'],
        ['Create with Veo', '使用 Veo 创建应用'],
        ['Duration of the videos', '视频的时长'],
        ['Edit safety settings', '编辑安全设置'],
        ['Gemini Co-Drawing', 'Gemini 协同绘画'],
        ['Gemini Ink Studio', 'Gemini 墨韵工坊'],
        ['giving us feedback', '向我们提供反馈'],
        ['Image to Voxel Art', '图像转体素艺术'],
        ['Input token cost:', '输入 Token 成本'],
        ['Large scale processing', '大规模处理'],
        ['Magical GIF Maker', '神奇 GIF 制作器'],
        ['Open editor settings', '打开编辑设置'],
        ['Open navigation menu', '打开导航菜单'],
        ['Open version history', '打开版本历史'],
        ['Research Visualization', '研究可视化'],
        ['Select camera source', '选择摄像头源'],
        ['Start screen sharing', '开始屏幕共享'],
        ['Switch to API key', '切换到 API 密钥'],
        ['Text safety settings', '文本安全设置'],
        ['Toggle thinking mode', '切换思考模式'],
        ['Upload a local image', '上传本地图像'],
        ['YouTube URL', 'YouTube 视频 URL 链接'],
        [' Explore the gallery ', '探索应用库'],
        [' Logs and Datasets ', '日志和数据集'],
        ['429 TooManyRequests', '429 过多请求'],
        ['Adjust writing tone', '调整写作语气'],
        ['Call tools natively', '原生调用工具'],
        ['Character consistency', '角色一致性'],
        ['Character Consistency', '角色一致性'],
        ['Chat with Maps Live', '地图实时对话'],
        ['Copy as markdown', '复制为 Markdown'],
        ['data use policy', '《数据使用政策》'],
        ['Describe your image', '描述您的图像'],
        ['Describe your video', '描述您的视频'],
        ['Design and typography', '设计与排版'],
        ['Design and Typography', '设计与排版'],
        ['Expand code snippet', '展开代码片段'],
        ['Gemini API Usage', 'Gemini API 使用'],
        ['Go to Projects Page', '前往项目页面'],
        ['Hide Code Assistant', '隐藏代码助手'],
        ['its permissions model', '其权限模型'],
        ['Make the app fullscreen', '全屏显示'],
        ['Microphone selector', '麦克风选择器'],
        ['Multimodal generation', '多模态生成'],
        ['No matching results', '没有匹配结果'],
        ['Not factually correct', '事实不准确'],
        ['Open in Cloud Console', '进入云终端'],
        ['Requests per hour', '每小时请求次数'],
        ['Rerun this turn', '重新运行当前步骤'],
        ['Run safety settings', '应用安全设置'],
        ['Set thinking budget', '设置思考预算'],
        ['Show Code Assistant', '显示代码助手'],
        ['Speaker 1 settings', '发言人 1 设置'],
        ['Speaker 2 settings', '发言人 2 设置'],
        ['Start from a template', '从模板开始'],
        ['Unsaved changes', '存在未保存的更改'],
        [' Last modified: ', '最后修改时间：'],
        [' Reset to default ', ' 重置为默认 '],
        [' Sign in to GitHub ', '登录 GitHub'],
        [' Upload Zip file ', '上传 ZIP 文件'],
        ['Animate an image', '为图像制作动画'],
        ['Aura Quiet Living', 'Aura 谧静生活'],
        ['Branch from here', '从此处创建分支'],
        ['Copying prompt...', '复制副本中...'],
        ['Create a new key', '创建一个新密钥'],
        ['Create a new project', '创建新项目'],
        ['create an API key', '创建 API 密钥'],
        ['Create an API Key', '创建 API 密钥'],
        ['Create new dataset', '创建新数据集'],
        ['Delete API key', ' 删除该 API 密钥'],
        ['Describe your idea', '描述您的创意'],
        ['Edit JSON schema', '编辑 JSON 架构'],
        ['Fetching quota...', '获取配额中...'],
        ['Google Maps API', 'Google 地图 API'],
        ['Hide code editor', '隐藏代码编辑器'],
        ['How do apps run?', '应用如何运行？'],
        ["It's time to build", '即刻开始构建'],
        ['Max context size', '最大上下文大小'],
        ['Movie scene script', '电影场景脚本'],
        ['Multiple speaker audio', '多人音频'],
        ['Open in Kaggle', '在 Kaggle 中打开'],
        ['Open settings menu', '打开设置菜单'],
        ['Ran bash command', '运行 bash 命令'],
        ['Realtime streaming', '实时流式传输'],
        ['Requests per day', '每天的请求次数'],
        ['Reset the conversation', '重置对话'],
        ['Saved to Drive', '已保存到云端硬盘'],
        ['Show code editor', '显示代码编辑器'],
        ['Understanding projects', '理解项目'],
        ['View Gemini API', '查看 Gemini API'],
        [' Create API key ', '创建 API 密钥'],
        [' Items per page: ', '每页项目数：'],
        [' Navigator APIs', ' Navigator API'],
        [' Output resolution ', '输出分辨率'],
        [' Usage and Billing ', '使用和计费'],
        ['Add stop sequence', '添加停止序列'],
        ['Back to prompts', '返回提示词列表'],
        ['Bananimate', 'Bananimate 动图大师'],
        ['Chess Chat', 'Chess Chat 棋子夜话'],
        ['Choose a template', '选择一个模板'],
        ['Copy to clipboard', '复制到剪贴板'],
        ['Create new folder', '创建新文件夹'],
        ['Defaults to 1 FPS', '默认为 1 FPS'],
        ['Export to Drive', '导出到云端硬盘'],
        ['Fast AI responses', '快速 AI 响应'],
        ['Filter by dataset', '按数据集过滤'],
        ['Function declarations', '函数声明'],
        ['No definition found', '未找到定义'],
        ['No references found', '未找到引用'],
        ['Open in Drive', '在云端硬盘中打开'],
        ['Optimizes for latency', '优化延迟'],
        ['Recently viewed', '最近查看的应用'],
        ['Remove project?', '确认删除项目？'],
        ['Rename API key', '重命名 API 密钥'],
        ['Saving to Drive', '保存到云端硬盘'],
        ['Select video source', '选择视频源'],
        ['Show run settings', '显示运行设置'],
        ['Spatial Understanding', '空间理解'],
        ['Synergy Intro', 'Synergy 协同序曲'],
        ['View All Libraries ', '查看所有库'],
        ['View more actions', '查看更多操作'],
        ['Voices from History', '历史的回响'],
        [' API quickstart ', 'API 快速入门'],
        [' Chat with models ', '与模型聊天'],
        [' Create a new app ', '创建新应用'],
        [' Create a new key ', '创建新密钥'],
        [' Last viewed: ', '最后查看时间：'],
        [' Restore to version ', '恢复版本'],
        [' Start new stream ', '开始新对话'],
        ['(experimental)', '（实验性功能）'],
        ['App file changes', '应用文件变更'],
        ['Creative composition', '创意合成'],
        ['Edit name of app', '编辑应用名称'],
        ['Gemini Runner', 'Gemini 极速跑酷'],
        ['Loading projects', '正在加载项目'],
        ['Lumina Festival', 'Lumina 光影节'],
        ['Lyria Camera', 'Lyria 律雅拾音镜'],
        ['Lyria RealTime', 'Lyria 实时交互'],
        ['MCP Maps Basic', 'MCP 地图基础版'],
        ['Name of the function', '函数名称'],
        ['Native image gen', '原生图像生成'],
        ['object consistency', '对象一致性'],
        ['One shot arcade', 'One Shot 街机'],
        ['Open in Colab', '在 Colab 中打开'],
        ['Podcast transcript', '播客文字稿'],
        ['Previous prompts', '上一个提示词'],
        ['Publish your app', '发布您的应用'],
        ['Ready to chat!', '准备好对话了！'],
        ['Record new audio', '录制新的录音'],
        ['Restore checkpoint', '恢复检查点'],
        ['Search for a project', '搜索项目'],
        ['Select a project', '选择一个项目'],
        ['Show in editor', '在编辑器中显示'],
        ['Single speaker audio', '单人音频'],
        ['Single-speaker audio', '单人音频'],
        ['Structured outputs', '结构化输出'],
        ['Type of the property', '属性类型'],
        ['Upload text file', '上传文本文件'],
        ['URL context tool', '网页内容工具'],
        ['Visual understanding', '视觉理解'],
        [' 0 time series ', '0 个时间序列'],
        [' Build AI apps ', '构建 AI 应用'],
        [' Connection failed ', '连接失败'],
        [' Link API key ', '链接 API 密钥'],
        [' Powered by Veo ', '由 Veo 生成'],
        [' Try Gemini 3 ', '体验 Gemini 3'],
        ['<=200K tokens', '<=20 万 Tokens'],
        ['> 200K tokens', '> 20 万 Tokens'],
        ['80s Mall Photo', '80 年代商场照'],
        ['Add to prompt', '添加到提示词中'],
        ['Agentic use cases', '智能体用例'],
        ['AI Action Engine', 'AI 行动引擎'],
        ['Angular Example', 'Angular 示例'],
        ['API key needed', '需要 API 密钥'],
        ['Audio transcription', '音频转录'],
        ['Data transformation', '数据转换'],
        ['EchoPaths', 'EchoPaths 途音叙事'],
        ['InfoGenius', 'InfoGenius 智汇星'],
        ['Model Run Stats', '模型运行统计'],
        ['Multi-speaker audio', '多人音频'],
        ['Name your project', '为项目命名'],
        ['Native tool use', '原生工具使用'],
        ['Navigator APIs', 'Navigator API'],
        ['Output tokens:', '输出 Tokens：'],
        ['p5js playground', 'p5.js 演练场'],
        ['Product generator', '产品生成器'],
        ['Save to GitHub', '保存到 GitHub'],
        ['Search in files', '在文件中搜索'],
        ['Stream realtime', '实时流式传输'],
        ['Stream Realtime', '实时流式传输'],
        ['Structured output', '结构化输出'],
        ['System instructions', '系统指令'],
        ['System Instructions', '系统指令'],
        ['Text-out models', '文本输出模型'],
        ['Untitled prompt', '无标题的对话'],
        ['Video understanding', '视频理解'],
        ['View all models', '查看所有模型'],
        ['View full image', '查看完整图片'],
        ['Visual Computer', '视觉计算终端'],
        [' Create dataset ', '创建数据集'],
        [' Generate media ', '生成式媒体'],
        [' Rename project ', '重命名项目'],
        ['400 BadRequest', '400 错误请求'],
        ['Add stop token', '添加停止标记'],
        ['Add stop...', '添加停止标记...'],
        ['Affective dialog', '情感化对话'],
        ['AI-powered Game', 'AI 驱动游戏'],
        ['API quickstart', 'API 快速入门'],
        ['Chat with Docs', '与 Docs 聊天'],
        ['Copy markdown', '复制 Markdown'],
        ['Copy project ID', '复制项目 ID'],
        ['Copy Project ID', '复制项目 ID'],
        ['Enable logging', '启用日志记录'],
        ['Filter by rating', '按评分过滤'],
        ['Filter by status', '按状态过滤'],
        ['Go to Symbol...', '转到符号...'],
        ['Input tokens:', '输入 Tokens：'],
        ['Media resolution', '媒体分辨率'],
        ['No data available.', '暂无数据'],
        ['Physics Simulation', '物理模拟'],
        ['Prompt history', '对话历史记录'],
        ['relevant package', '相关软件包'],
        ['Reload the app', '重新加载应用'],
        ['Reset defaults', '恢复默认设置'],
        ['Restart stream', '重新开始对话'],
        ['Search for a model', '搜索模型'],
        ['Style instructions', '风格指令'],
        ['View API keys', '查看 API 密钥'],
        ['View in charts', '在图表中查看'],
        [' Import projects ', '导入项目'],
        [' Switch model? ', '切换模型？'],
        [' Tools and MCP ', '工具和 MCP'],
        ['Advanced settings', '高级设置'],
        ['API documentation', 'API 文档'],
        ['Cancel generation', '取消生成'],
        ['Copy API key', '复制 API 密钥'],
        ['Create new file', '创建新文件'],
        ['Dangerous Content', '危险内容'],
        ['Developer forum', '开发者论坛'],
        ['Filter by model', '按模型过滤'],
        ['Filter by Model', '按模型筛选'],
        ['Filter by tools', '按工具过滤'],
        ['Flash UI', 'Flash UI 界面闪造'],
        ['Flashcard Maker', '闪卡制作器'],
        ['Format Document', '格式化文档'],
        ["I'm feeling lucky", '手气不错'],
        ['Image Enhancement', '图像增强'],
        ['Leave full screen', '退出全屏'],
        ['Link 2 Ink', 'Link 2 Ink 智绘'],
        ['Make a new copy', '创建新副本'],
        ['MediaSim', 'MediaSim 媒体模拟'],
        ['Negative prompt', '反向提示词'],
        ['No data available', '暂无数据'],
        ['No Data Available', '暂无数据'],
        ['Number of results', '结果数量'],
        ['One Shot', 'One Shot 单次生成'],
        ['Proactive audio', '主动式音频'],
        ['Recent apps', '最近使用的应用'],
        ['Remove parameters', '移除参数'],
        ['Search for an app', '搜索应用'],
        ['Session Context', '会话上下文'],
        ['Sexually Explicit', '色情内容'],
        ['Speech Generation', '语音生成'],
        ['Synthwave Space', '合成波太空'],
        ['to get started.', '即可开始。'],
        ['Usage & Billing', '用量与计费'],
        ['Veo 3 Gallery', 'Veo 3 作品库'],
        ['Visual Editor', '可视化编辑器'],
        ['Voxel Toy Box', '像素玩具盒子'],
        ['YouTube Video', 'YouTube 视频'],
        [' 404 NotFound ', '404 未找到'],
        [' Create project ', '创建项目'],
        [' Created by you ', '由您创建'],
        [' Import project ', '导入项目'],
        [' Remove project ', '删除项目'],
        [' Save changes ', ' 保存更改 '],
        [' Stream is live ', '正在对话'],
        ['Ask the Manual', '说明书问答'],
        ['Choose a key', '选择一个密钥'],
        ['Cost Estimation ', '成本估算'],
        ['deselect all', '取消选择所有'],
        ['Developer docs', '开发者文档'],
        ['Download the app', '下载应用'],
        ['Function calling', '函数调用'],
        ['Function Calling', '函数调用'],
        ['Generate content', '生成内容'],
        ['Generate media', '生成式媒体'],
        ['Generate Media', '生成式媒体'],
        ['Get API key', '获取 API 密钥'],
        ['Go to Definition', '转到定义'],
        ['Go to References', '转到引用'],
        ['Google Search', 'Google 搜索'],
        ['Imagen prompt', 'Imagen 对话'],
        ['January 2025', '2025 年 1 月'],
        ['Leave fullscreen', '退出全屏'],
        ['Music generation', '音乐生成'],
        ['OK, got it', '好的，我明白了'],
        ['projects page.', '项目页面，'],
        ['Script builder', '脚本生成器'],
        ['Search grounding', '搜索引用'],
        ['Shader Pilot', '着色器飞行员'],
        ['Sharing Prompt', '分享提示词'],
        ['Sky Metropolis', '天空大都会'],
        ['Speech to text', '语音转文本'],
        ['Terms of service', '服务条款'],
        ['Terms of Service', '服务条款'],
        ['Text translation', '文本翻译'],
        ['Text-to-speech', '文本转语音'],
        ['Token Usage:', 'Token 使用：'],
        ['Total tokens:', '总 Tokens：'],
        ['Transcribe audio', '转录音频'],
        ['Unselect all', '取消选择所有'],
        ['Video Analyzer', '视频分析器'],
        [' Add to chat ', '添加到对话'],
        [' Back to start ', '返回开始'],
        [' Enable saving ', '启用保存'],
        [' Monitor usage ', '监控用量'],
        ['Are you sure?', '您确定吗？'],
        ['August 2024', '2024 年 8 月'],
        ['Billing Support', '结算支持'],
        ['Code generation', '代码生成'],
        ['Code Generation', '代码生成'],
        ['Command Palette', '命令面板'],
        ['Copy this app', '复制此应用'],
        ['Count tokens', '计算 Tokens'],
        ['Current version', '当前版本'],
        ['Delete property', '删除属性'],
        ['Dismiss all', '清空消息通知'],
        ['Downloading...', '下载中...'],
        ['Editor settings', '编辑设置'],
        ['File explorer', '文件浏览器'],
        ['for examples.', '查看示例。'],
        ['From revision', '从修订版本'],
        ['Full outage', '完全中断停机'],
        ['Generate speech', '生成语音'],
        ['Generated Image', '生成图像'],
        ['Good response', '优质的回复'],
        ['Image to Code', '图像转代码'],
        ['Images & text', '图像和文本'],
        ['Infinite Heroes', '无限英雄'],
        ['Maps Explorer', '地图浏览器'],
        ['Model selection', '模型选择'],
        ['Name your key', '为密钥命名'],
        ['Peek Definition', '速览定义'],
        ['Peek References', '速览引用'],
        ['Pixshop', 'Pixshop 创意修图'],
        ['Project details', '项目详情'],
        ['Prompts gallery', '提示词库'],
        ['React example', 'React 示例'],
        ['Rename Symbol', '重命名符号'],
        ['Safety settings', '安全设置'],
        ['Save this app', '保存此应用'],
        ['Select Language', '选择语言'],
        ['Start recording', '开始录制'],
        ['Start sketching', '开始绘制'],
        ['Submit feedback', '提交反馈'],
        ['SVG Generator', 'SVG 生成器'],
        ['Text generation', '文本生成'],
        ['Thinking budget', '思考预算'],
        ['Turn coverage', '轮次覆盖率'],
        ['Visual Coding', '可视化编程'],
        ['What is this?', '这是什么？'],
        ['World knowledge', '世界知识'],
        [' Learn more.', '了解更多。'],
        [' Render Start ', '开始渲染'],
        [' Running for ', '运行时间 '],
        [' Take a photo ', '拍摄照片'],
        ['A spider web', '一张蜘蛛网'],
        ['Add parameters', '添加参数'],
        ['All datasets', '所有数据集'],
        ['Analyze images', '分析图像'],
        ['Bad response', '不佳的回复'],
        ['Campfire story', '篝火故事'],
        ['Code assistant', '代码助手'],
        ['Code Assistant', '代码助手'],
        ['Code execution', '代码执行'],
        ['Copy as text', '复制为文本'],
        ['Delete content', '删除内容'],
        ['Download app', '下载该 APP'],
        ['Explore models', '探索模型'],
        ['Font ligatures', '字体连字'],
        ['Gemma models', 'Gemma 模型'],
        ['Generate Image', '生成图像'],
        ['Generate Video', '生成视频'],
        ['Generative UI', '生成式 UI'],
        ['Google Maps', 'Google 地图'],
        ['Image to video', '图生视频'],
        ['Kinetic Shapes', '动感几何'],
        ['Maps Planner', '地图规划器'],
        ['Maps Styling', '地图风格化'],
        ['MCP Maps 3D', 'MCP 3D 地图'],
        ['Model settings', '模型设置'],
        ['Partial outage', '部分中断'],
        ['Past Incidents', '历史事件'],
        ['Privacy policy', '隐私政策'],
        ['Privacy Policy', '隐私政策'],
        ['Productivity', '生产力工具'],
        ['Project number', '项目编号'],
        ['Prompt gallery', '提示词库'],
        ['Select a model', '选择模型'],
        ['Set up billing', '设置账单'],
        ['Shared with me', '与我共享'],
        ['Stop recording', '停止录音'],
        ['Temporary chat', '临时聊天'],
        ['Terminal input', '终端输入'],
        ['Text rendering', '文本渲染'],
        ['Thinking level', '思考等级'],
        ['Thinking Space', '思考空间'],
        ['Token count', 'Tokens 计数'],
        ['Transportation', '交通工具'],
        ['Veo Cameos', 'Veo 众星客串'],
        ['Video duration', '视频时长'],
        ['Video settings', '视频设置'],
        ['Voice settings', '语音设置'],
        [' pricing page', '定价页面'],
        ['Add a comment', '添加评论'],
        ['Add rectangle', '添加矩形'],
        ['Audio Avatars', '声音化身'],
        ['ChatterBots', '聊天机器人'],
        ['Code Editor', '代码编辑器'],
        ['Default model', '默认模型'],
        ['Delete prompt', '删除对话'],
        ['Dictation App', '听写应用'],
        ['Edit an image', '编辑图像'],
        ['End Tokens', '结束 Tokens'],
        ['Image editing', '图像编辑'],
        ['Image Editing', '图像编辑'],
        ['Infinite Wiki', '无限维基'],
        ['No API Key', '无 API 密钥'],
        ['Output format', '输出格式'],
        ['Output length', '输出长度'],
        ['Paint A Place', '描绘一处'],
        ['Profile photo', '个人照片'],
        ['Raw structure', '原始结构'],
        ['Re-take photo', '重新拍照'],
        ['Restored from', '恢复自：'],
        ['Resume stream', '恢复对话'],
        ['Rotate device', '旋转设备'],
        ['Send feedback', '发送反馈'],
        ['Send prompt', '发送提示词'],
        ['Sticky scroll', '粘性滚动'],
        ['Text wrapping', '文本换行'],
        ['Thinking mode', '思考模式'],
        ['To revision', '至修订版本'],
        ['Try Gemini', '体验 Gemini'],
        ['Unpin app', '取消固定应用'],
        ['Upload a file', '上传文件'],
        ['URL context', '网址上下文'],
        ['Use GitHub', '使用 GitHub'],
        [' AI Features ', 'AI 功能'],
        [' All models ', '所有模型'],
        [' GenMedia ', '生成式媒体'],
        ['4K Wallpapers', '4K 壁纸'],
        ['A minute ago', '一分钟前'],
        ['Add property', '添加属性'],
        ['All projects', '所有项目'],
        ['All statuses', '所有状态'],
        ['An empty app', '空白应用'],
        ['Annotate app', '注释应用'],
        ['Chat example', '聊天示例'],
        ['Compare mode', '比较模式'],
        ['Explore docs', '探索文档'],
        ['First opened', '首次打开'],
        ['Hide preview', '隐藏预览'],
        ['Last hour', '最近 1 小时'],
        ['Last Hour', '最近 1 小时'],
        ['Loaded app', '已加载应用'],
        ['Long Context', '长上下文'],
        ['More options', '更多选项'],
        ['My Drive', '我的云端硬盘'],
        ['Native Audio', '原生音频'],
        ['Other models', '其他模型'],
        ['Past Forward', '时光倒流'],
        ['Project name', '项目名称'],
        ['Record Audio', '录制音频'],
        ['Remove image', '移除照片'],
        ['Remove media', '移除媒体'],
        ['Remove video', '移除视频'],
        ['Rename app', '重命名应用'],
        ['Rename key', '重命名密钥'],
        ['Run prompt', '运行提示词'],
        ['Run settings', '运行设置'],
        ['Sample Media', '媒体示例'],
        ['Scroll right', '向右滚动'],
        ['Select color', '选择颜色'],
        ['Share prompt', '分享对话'],
        ['Share Prompt', '分享对话'],
        ['Share Screen', '共享屏幕'],
        ['Show preview', '显示预览'],
        ['Stop editing', '停止编辑'],
        ['System theme', '系统主题'],
        ['Tempo Strike', '律动斩击'],
        ['Thinking...', '思考中...'],
        ['Tool calling', '工具调用'],
        ['Upload files', '上传文件'],
        ['Upload Files', '上传文件'],
        ['Upload Image', '上传图像'],
        ['URL Context', 'URL上下文'],
        ['Veo prompt', 'Veo 提示词'],
        ['View billing', '查看账单'],
        [' Copy name ', '复制名称'],
        [' documentation ', '文档'],
        [' Let it snow ', '下雪吧'],
        [' Re-record ', '重新录制'],
        ['Add comment', '添加注释'],
        ['All ratings', '所有评分'],
        ['Chat prompt', '聊天对话'],
        ['Chat Prompt', '聊天对话'],
        ['Coming Soon', '即将推出'],
        ['Educational', '知识科普'],
        ['File Search', '文件搜索'],
        ['Get started', '开始使用'],
        ['Home Canvas', '家居画布'],
        ['Last opened', '上次打开'],
        ['Light theme', '浅色主题'],
        ['Loading...', '加载中...'],
        ['Make a copy', '创建副本'],
        ['Models Page', '模型页面'],
        ['Not helpful', '帮助不大'],
        ['Previous page', '上一页'],
        ['Prompt name', '对话名称'],
        ['Rate limits', '速率限制'],
        ['Remove file', '移除文件'],
        ['Run Chase', '板球追分赛'],
        ['Run the app', '运行应用'],
        ['Save prompt', '保存对话'],
        ['Save Prompt', '保存对话'],
        ['Saving…..', '保存中...'],
        ['Scroll left', '向左滚动'],
        ['Showcase.', '作品展示。'],
        ['Streaming', '流式传输中'],
        ['Take screenshot', '截图'],
        ['Unavailable', '暂不可用'],
        ['Upload File', '上传文件'],
        ['View status', '查看状态'],
        [' All apps ', '所有应用'],
        [' Code gen ', '代码生成'],
        [' Enter an ', '输入一个'],
        [' Playground ', '工作台'],
        [' Raw Mode ', '原始模式'],
        ['3D Building', '3D 建造'],
        ['Add dialog', '添加对话'],
        ['All Models', '所有模型'],
        ['Aspect ratio', '宽高比'],
        ['Block most', '屏蔽多数'],
        ['Block some', '屏蔽部分'],
        ['Clear chat', '清空对话'],
        ['Close chat', '关闭聊天'],
        ['Close file', '关闭文件'],
        ['Copy app', '复制该 APP'],
        ['Create key', '创建密钥'],
        ['Created on', '创建日期'],
        ['Creativity', '创意工坊'],
        ['Dark theme', '深色主题'],
        ['Delete app', '删除应用'],
        ['Delete key', '删除密钥'],
        ['Deploy app', '部署应用'],
        ['Disclaimer', '免责声明'],
        ['Disconnect', '断开连接'],
        ['ENHANCE!', '无限放大！'],
        ['GemBooth', 'Gem 趣拍亭'],
        ['Human Eval', '人工评估'],
        ['Large view', '大型视图'],
        ['Learn more', '了解详情'],
        ['Live Audio', '实时音频'],
        ['Lower cost', '更低成本'],
        ['Multilingual', '多语言'],
        ['My history', '历史记录'],
        ['Not modified', '未修改'],
        ['Quota tier', '配额层级'],
        ['Rate limit', '速率限制'],
        ['Rate Limit', '速率限制'],
        ['Remove app', '删除应用'],
        ['Render End', '渲染结束'],
        ['Saving...', '保存中...'],
        ['Select all', '选择所有'],
        ['Time range', '时间范围'],
        ['Time Range', '时间范围'],
        ['Upload PDF', '上传 PDF'],
        ['Use Policy', '使用政策'],
        ['View usage', '查看用量'],
        [' Acknowledge ', '确认'],
        [' API key ', 'API 密钥'],
        [' History ', '历史记录'],
        [' Per page: ', '每页：'],
        ['Add arrow', '添加箭头'],
        ['Add files', '添加文件'],
        ['Audio Orb', '灵动音球'],
        ['Block few', '屏蔽少量'],
        ['Changelog', '更新日志'],
        ['Copy Code', '复制代码'],
        ['Copy text', '复制文本'],
        ['Documentation', '文档'],
        ['Fit Check', '穿搭检测'],
        ['Free tier', '免费套餐'],
        ['Low latency', '低延迟'],
        ['Minimap', '代码缩略图'],
        ['Move file', '移动文件'],
        ['Proactive', '主动智能'],
        ['Project id', '项目 ID'],
        ['Share app', '分享应用'],
        ['Summarization', '摘要'],
        ['Total cost:', '总成本'],
        ['VibeCheck', '氛围检查'],
        ['View diff', '查看差异'],
        ['View Docs', '查看文档'],
        ['Your apps', '您的应用'],
        [' Fullscreen ', '全屏'],
        [' Group by ', '分组按'],
        [' Mobile ', '移动设备'],
        [' Tablet ', '平板设备'],
        [' tokens ', ' Tokens '],
        ['Add text', '添加文本'],
        ['All time', '所有时间'],
        ['API Docs', 'API 文档'],
        ['API keys', 'API 密钥'],
        ['API Keys', 'API 密钥'],
        ['Architecture', '建筑'],
        ['Autosave', '自动保存'],
        ['Block none', '不屏蔽'],
        ['Checkpoint', '检查点'],
        ['Close?', '要关闭吗？'],
        ['Extracting', '提取中'],
        ['Get code', '获取代码'],
        ['Identified', '已识别'],
        ['Instructions', '说明'],
        ['Line numbers', '行号'],
        ['Live API', '实时 API'],
        ['Microphone', '麦克风'],
        ['Multimodal', '多模态'],
        ['New chat', '新建聊天'],
        ['Resolution', '分辨率'],
        ['Save app', '保存应用'],
        ['should not', '不应以'],
        ['Showcase', '作品展示'],
        ['Studio', '开发工作台'],
        ["the user's", '用户的'],
        ['Thoughts', '思考过程'],
        ['Use case', '使用场景'],
        ['Webcam', '网络摄像头'],
        ["What's new", '新功能'],
        [' Ran for ', '运行了'],
        ['24 hours', '24 小时'],
        ['3D Games', '3D 游戏'],
        ['Created', '创建时间'],
        ['Dashboard', '仪表盘'],
        ['Description', '描述'],
        ['Filter by', '过滤按'],
        ['Folding', '代码折叠'],
        ['Full screen', '全屏'],
        ['Mitigated', '已缓解'],
        ['New app', '新建 APP'],
        ['Next page', '下一页'],
        ['Pin app', '固定应用'],
        ['Suggestions', '建议'],
        ['Temperature', '温度'],
        ['Top P', 'Top-P 采样'],
        ['Translation', '翻译'],
        ['Unlimited', '无限制'],
        [' Featured ', '精选'],
        [' Model: ', '模型：'],
        [', which ', '，它会'],
        ['Best for', '最适合'],
        ['Datasets', '数据集'],
        ['Deleting', '删除中'],
        ['Detected', '已检测'],
        ['Embeddings', '嵌入'],
        ['Failed', '任务失败'],
        ['Frame rate', '帧率'],
        ['Harassment', '骚扰'],
        ['Imported', '已导入'],
        ['Modified', '已修改'],
        ['New path', '新路径'],
        ['Parameters', '参数'],
        ['Pinned', '固定应用'],
        ['Previous', '上一个'],
        ['Resolved', '已解决'],
        ['Screencast', '截图'],
        ['screenshot', '截屏'],
        ['Screenshot', '截屏'],
        ['Stream', '流式传输'],
        ['SynthID', '合成 ID'],
        ['System', '跟随系统'],
        ['Take photo', '拍照'],
        ['This Month', '本月'],
        ['Try it', '体验一下'],
        [' Current ', '当前'],
        [' Restore ', '恢复'],
        [' Settings', '设置'],
        [' Sources ', '来源'],
        ['Dataset', '数据集'],
        ['drive', '云端硬盘'],
        ['Drive', '云端硬盘'],
        ['Gallery', '应用库'],
        ['Light', '日间主题'],
        ['Reasoning', '推理'],
        ['Rerun', '重新运行'],
        ['Running', '运行中'],
        ['Source:', '来源：'],
        ['Tiny Cats', '小猫'],
        ['Unsaved', '未保存'],
        ['Updated', '更新于'],
        ['Yesterday', '昨天'],
        [' Device ', '设备'],
        [' Images ', '图像'],
        [' Screen ', '屏幕'],
        [' Update ', '更新'],
        ['Camera', '摄像头'],
        ['Category', '类别'],
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
        ['Saving', '保存中'],
        ['Thinking', '思考'],
        [' Audio ', '音频'],
        [' error ', '错误'],
        [' Reset ', '重置'],
        [' Theme ', '主题'],
        ['Added', '已添加'],
        ['Billing', '计费'],
        ['Confirm', '确认'],
        ['Default', '默认'],
        ['Dismiss', '关闭'],
        ['FAQ', '常见问题'],
        ['Latency', '延迟'],
        ['Minimal', '最小'],
        ['Objects', '物体'],
        ['Owner', '所有者'],
        ['Preview', '预览'],
        ['Project', '项目'],
        ['Related', '相关'],
        ['Saved', '已保存'],
        ['Success', '成功'],
        ['Warning', '警告'],
        [' Done ', '完成'],
        [' file ', '文件'],
        [' Home ', '首页'],
        ['Animal', '动物'],
        ['Cancel', '取消'],
        ['Charts', '图表'],
        ['Coding', '编码'],
        ['Delete', '删除'],
        ['Filter', '筛选'],
        ['Flower', '花朵'],
        ['Gaming', '游戏'],
        ['Import', '导入'],
        ['Nature', '自然'],
        ['Next', '下一个'],
        ['Output', '输出'],
        ['Rating', '评分'],
        ['Remove', '删除'],
        ['replay', '重新'],
        ['Rotate', '旋转'],
        ['Search', '搜索'],
        ['Speech', '语音'],
        ['Status', '状态'],
        ['Videos', '视频'],
        ['Build', '构建'],
        ['Clear', '清除'],
        ['close', '关闭'],
        ['Close', '关闭'],
        ['Files', '文件'],
        ['image', '图像'],
        ['Input', '输入'],
        ['login', '登录'],
        ['Model', '模型'],
        ['Paste', '粘贴'],
        ['Photo', '照片'],
        ['Reset', '重置'],
        ['Share', '分享'],
        ['Space', '太空'],
        ['Start', '开始'],
        ['terms', '条款'],
        ['Terms', '条款'],
        ['Title', '标题'],
        ['Today', '今天'],
        ['Tools', '工具'],
        ['Usage', '使用'],
        ['Video', '视频'],
        ['Voice', '语音'],
        ['Auto', '自动'],
        ['Chat', '聊天'],
        ['Code', '代码'],
        ['Copy', '复制'],
        ['Fail', '失败'],
        ['Food', '食物'],
        ['Free', '免费'],
        ['Keys', '密钥'],
        ['Live', '实时'],
        ['Medium', '中'],
        ['Mode', '模式'],
        ['Move', '移动'],
        ['Name', '名称'],
        ['Paid', '付费'],
        ['Peek', '速览'],
        ['Save', '保存'],
        ['Send', '发送'],
        ['Stop', '停止'],
        ['Talk', '交谈'],
        ['Text', '文本'],
        ['Type', '类型'],
        ['Undo', '撤销'],
        ['User', '用户'],
        ['All', '全部'],
        ['Cut', '剪切'],
        ['Empty', '空'],
        ['HOT', '热门'],
        ['Key', '密钥'],
        ['Off', '关闭'],
        ['Run', '运行'],
        ['Good', '好'],
        ['High', '高'],
        ['OK', '确定'],
        ['and', '和'],
        ['Bad', '坏'],
        ['Low', '低'],
        ['New', '新'],
        ['NEW', '新'],
        ['me', '我'],
        ['s ', '秒'],
      ],
    },
    'gemini.google.com': {
      language: 'zh-cn',
      enabled: true,
      styles: [],
      blockedElements: [],
      extendedElements: [],
      customAttributes: [],
      blockedAttributes: [],
      jsRules: [],
      regexRules: [],
      textRules: [
        [' Connected Apps ', ' 关联的应用 '],
        [' Deep Research ', ' 深度研究 '],
        [' Canvas ', ' 画布 '],
      ],
    },
  },
  'zh-tw': {
    'aistudio.google.com': {
      language: 'zh-tw',
      enabled: true,
      styles: [],
      blockedElements: [],
      extendedElements: [],
      customAttributes: [],
      blockedAttributes: [],
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
        ['Saving…', '儲存中...'],
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

const EMBEDDED_SITES = ['aistudio.google.com', 'gemini.google.com'];

(() => {
  // src/config/languages.js
  var SUPPORTED_LANGUAGES = [
    { code: 'zh-cn', name: '简体中文', flag: '🇨🇳' },
    { code: 'zh-tw', name: '繁體中文', flag: '🇹🇼' },
  ];

  // src/modules/utils/language.js
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
      const cdnUrls = [`https://raw.githubusercontent.com/${repoUser}/${repoName}/main/src/translations/${userLang2}/sites/${hostname2}.js`, `https://cdn.jsdelivr.net/gh/${repoUser}/${repoName}@latest/src/translations/${userLang2}/sites/${hostname2}.js${cacheBuster}`];
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
