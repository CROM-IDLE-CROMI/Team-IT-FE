# 커스텀 도메인 설정 가이드

이 프로젝트는 기본적으로 `npm run dev` 실행 시 커스텀 도메인을 사용하도록 설정되어 있습니다.

## 자동 설정 (권장)

다음 PowerShell 명령어를 **관리자 권한**으로 실행하세요:

```powershell
Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "127.0.0.1 team-it.local"
```

## 수동 설정

1. **관리자 권한으로 메모장 실행**
   - Windows 키 + R → `notepad` 입력 → Ctrl+Shift+Enter

2. **hosts 파일 열기**
   - 파일 → 열기 → `C:\Windows\System32\drivers\etc\hosts`

3. **파일 끝에 다음 줄 추가**
   ```
   127.0.0.1 team-it.local
   ```

4. **저장하고 닫기**

## 실행

```bash
npm run dev
```

## 접속 URL

- **커스텀 도메인**: http://team-it.local:3000
- **일반 localhost**: http://localhost:3000 (hosts 설정 없이도 접속 가능)
- **네트워크 접속**: http://[당신의IP]:3000

## 추가 명령어

- `npm run dev:localhost` - localhost만 사용하는 기존 방식
- `npm run dev` - 커스텀 도메인 사용 (hosts 설정 필요)