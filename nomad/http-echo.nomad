job "http-echo-test" {
    datacenters = ["dc1"]
    group "http-echo" {
        count = 1
        network {
            port "http" {
                to = 3000
            }
        }
        task "web" {
            driver = "raw_exec"
            config {
                command = "../npm start"
            }
        }
    }
}