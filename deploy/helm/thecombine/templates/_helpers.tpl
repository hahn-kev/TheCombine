{{/* Build container image name */}}
{{- define "thecombine.ingressHost" -}}
  {{- if .Values.ingressHost }}
    {{- print .Values.ingressHost }}
  {{- else }}
    {{- print .Values.global.serverName }}
  {{- end }}
{{- end }}

{{- define "thecombine.secretName" -}}
  {{- if .Values.tlsSecretName }}
    {{- print .Values.tlsSecretName }}
  {{- else }}
    {{- $hostString := replace "." "-" .Values.global.serverName }}
    {{- print $hostString "-tls" }}
  {{- end }}
{{- end }}
