$port = 8085
$baseDir = "C:\Users\luiso\Desktop\Landing Page 147"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Start()
Write-Host "Server running at http://localhost:$port/"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response
        $localPath = $req.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($localPath)) { $localPath = "index.html" }
        $filePath = Join-Path $baseDir $localPath.Replace('/', '\')

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $res.StatusCode = 200
            if ($filePath.EndsWith(".html")) { $res.ContentType = "text/html; charset=utf-8" }
            elseif ($filePath.EndsWith(".css")) { $res.ContentType = "text/css; charset=utf-8" }
            elseif ($filePath.EndsWith(".js")) { $res.ContentType = "application/javascript; charset=utf-8" }
            elseif ($filePath.EndsWith(".jpg") -or $filePath.EndsWith(".jpeg")) { $res.ContentType = "image/jpeg" }
            elseif ($filePath.EndsWith(".png")) { $res.ContentType = "image/png" }
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }
        $res.Close()
    } catch {
        # ignore closed connection
    }
}
