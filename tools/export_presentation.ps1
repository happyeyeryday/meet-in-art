param(
    [Parameter(Mandatory = $true)][string]$InputPptx,
    [Parameter(Mandatory = $true)][string]$OutputPdf,
    [string]$PreviewDirectory
)

$ErrorActionPreference = 'Stop'
$inputPath = (Resolve-Path -LiteralPath $InputPptx).Path
$outputPath = [System.IO.Path]::GetFullPath($OutputPdf)
if ($inputPath -eq $outputPath) { throw 'The PDF output must differ from the input.' }
[System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($outputPath)) | Out-Null

$powerPoint = $null
$presentation = $null
try {
    $powerPoint = New-Object -ComObject PowerPoint.Application
    # ReadOnly = true; Untitled = false; WithWindow = false.
    $presentation = $powerPoint.Presentations.Open($inputPath, -1, 0, 0)
    $slideCount = $presentation.Slides.Count
    # ppSaveAsPDF = 32. The source PPTX is not saved or modified.
    $presentation.SaveAs($outputPath, 32)
    if ($PreviewDirectory) {
        $previewPath = [System.IO.Path]::GetFullPath($PreviewDirectory)
        [System.IO.Directory]::CreateDirectory($previewPath) | Out-Null
        for ($i = 1; $i -le $slideCount; $i++) {
            $path = Join-Path $previewPath ('slide-{0:D2}.png' -f $i)
            $presentation.Slides.Item($i).Export($path, 'PNG', 1280, 720)
        }
    }
    [PSCustomObject]@{
        slides = $slideCount
        pdfBytes = (Get-Item -LiteralPath $outputPath).Length
        renderer = 'Microsoft PowerPoint'
    } | ConvertTo-Json -Compress
} finally {
    if ($presentation) {
        $presentation.Close()
        [void][Runtime.InteropServices.Marshal]::ReleaseComObject($presentation)
    }
    if ($powerPoint) {
        # Leave any other presentations the user has open alone.
        if ($powerPoint.Presentations.Count -eq 0) { $powerPoint.Quit() }
        [void][Runtime.InteropServices.Marshal]::ReleaseComObject($powerPoint)
    }
}
