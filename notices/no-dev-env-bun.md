# bun cannot run nuxt in dev within a docker container
```bash
2024-02-11 13:29:26 fatal error: all goroutines are asleep - deadlock!
2024-02-11 13:29:26
2024-02-11 13:29:26 goroutine 1 [chan receive]:
2024-02-11 13:29:26 github.com/evanw/esbuild/internal/helpers.(*ThreadSafeWaitGroup).Wait(...)
2024-02-11 13:29:26     github.com/evanw/esbuild/internal/helpers/waitgroup.go:36
2024-02-11 13:29:26 main.runService.func2()
2024-02-11 13:29:26     github.com/evanw/esbuild/cmd/esbuild/service.go:114 +0x88
2024-02-11 13:29:26 main.runService(0x1)
2024-02-11 13:29:26     github.com/evanw/esbuild/cmd/esbuild/service.go:160 +0x488
2024-02-11 13:29:26 main.main()
2024-02-11 13:29:26     github.com/evanw/esbuild/cmd/esbuild/main.go:240 +0x890
2024-02-11 13:29:26
2024-02-11 13:29:26 goroutine 6 [chan receive]:
2024-02-11 13:29:26 main.runService.func1()
2024-02-11 13:29:26     github.com/evanw/esbuild/cmd/esbuild/service.go:98 +0x40
2024-02-11 13:29:26 created by main.runService
2024-02-11 13:29:26     github.com/evanw/esbuild/cmd/esbuild/service.go:97 +0x194
2024-02-11 13:29:26
2024-02-11 13:29:26 goroutine 7 [chan receive]:
2024-02-11 13:29:26 main.(*serviceType).sendRequest(0x4000174060, {0x49d300, 0x4000174360})
2024-02-11 13:29:26     github.com/evanw/esbuild/cmd/esbuild/service.go:192 +0x114
2024-02-11 13:29:26 main.runService.func3()
2024-02-11 13:29:26     github.com/evanw/esbuild/cmd/esbuild/service.go:125 +0x38
2024-02-11 13:29:26 created by main.runService
2024-02-11 13:29:26     github.com/evanw/esbuild/cmd/esbuild/service.go:122 +0x2f0
2024-02-11 13:29:26 error: script "dev" was terminated by signal SIGSEGV (Address boundary error)
2024-02-11 13:29:26 Segmentation fault
```
