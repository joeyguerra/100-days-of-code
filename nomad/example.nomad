job "example" {
  datacenters = ["dc1"]
  group "web" {
    task "front" {
      driver = "raw_exec"
      config {
        command = "node"
        args = ["/Users/joeyguerra/src/joeyguerra/100daysofcode/nomad/server.mjs"]
      }
    }
  }
}
