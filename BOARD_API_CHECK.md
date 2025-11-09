# Board 관련 API 연동 상태 확인

## ✅ 완료된 API 연동

### 게시글 관련
1. **POST /v1/board** - 게시글 작성
   - 📍 위치: `src/pages/BoardPage/BoardWrite.tsx`
   - ✅ 연동 완료

2. **GET /v1/board** - 게시글 목록 조회 (페이지네이션, 검색, 카테고리 필터링)
   - 📍 위치: `src/pages/BoardPage/Boarder.tsx`
   - ✅ 연동 완료
   - 쿼리 파라미터: `category`, `keyword`, `pageable` (JSON)

3. **GET /v1/board/{postId}** - 게시글 상세 조회
   - 📍 위치: `src/pages/BoardPage/BoardDetail.tsx`
   - ✅ 연동 완료

4. **PATCH /v1/board/{postId}** - 게시글 수정
   - 📍 위치: `src/pages/BoardPage/BoardDetail.tsx`
   - ✅ 연동 완료
   - 요청 body: `{ title, content, category }`

5. **DELETE /v1/board/{postId}** - 게시글 삭제
   - 📍 위치: `src/pages/BoardPage/BoardDetail.tsx`
   - ✅ 연동 완료

### 댓글 관련
6. **GET /v1/board/{postId}/comments** - 댓글 목록 조회
   - 📍 위치: `src/pages/BoardPage/BoardDetail.tsx`
   - ✅ 연동 완료
   - 답글 구조: `replies` 배열로 중첩 댓글 지원

7. **POST /v1/board/{postId}/comments** - 댓글 작성
   - 📍 위치: `src/pages/BoardPage/BoardDetail.tsx`
   - ✅ 연동 완료
   - 요청 body: `{ content, parentCommentId? }` (parentCommentId 있으면 답글)

8. **PATCH /v1/board/{postId}/comments/{commentId}** - 댓글 수정
   - 📍 위치: `src/pages/BoardPage/BoardDetail.tsx`
   - ✅ 연동 완료
   - 요청 body: `{ content }`

### 스크랩 관련
9. **POST /v1/board/{postId}/scrap** - 스크랩 추가
   - 📍 위치: `src/utils/scrapUtils.ts`
   - ✅ 연동 완료
   - 사용: `src/pages/BoardPage/Boarder.tsx`

10. **DELETE /v1/board/{postId}/scrap** - 스크랩 삭제
    - 📍 위치: `src/utils/scrapUtils.ts`
    - ✅ 연동 완료
    - 사용: `src/components/ScrapedPosts.tsx`

11. **GET /v1/board/scrap** - 스크랩 목록 조회
    - 📍 위치: `src/utils/scrapUtils.ts`
    - ✅ 연동 완료
    - 사용: `src/components/ScrapedPosts.tsx`

---

## ❓ 확인 필요 또는 누락된 기능

### 댓글 삭제
- **DELETE /v1/board/{postId}/comments/{commentId}**
  - 현재 상태: ❌ 미구현
  - 이유: 제공된 API 명세에 포함되지 않았음
  - 필요 여부: 확인 필요
  - 현재 동작: 댓글 수정 기능만 있음

### 좋아요 기능
- **게시글 좋아요**: API 명세에 없음 (응답에 `likeCount`는 포함되어 있으나 좋아요 버튼/API 없음)
- **댓글 좋아요**: API 명세에 없음 (응답에 `likeCount`는 포함되어 있으나 좋아요 버튼/API 없음)

---

## 📝 요약

✅ **총 11개의 Board 관련 API 중 11개 연동 완료**

모든 제공된 API 명세에 따라 연동이 완료되었습니다. 
- 댓글 삭제와 좋아요 기능은 제공된 API 명세에 포함되지 않았으므로, 백엔드 API 명세를 확인하거나 추가 개발이 필요할 수 있습니다.

---

## 🔍 주요 기능 체크리스트

- [x] 게시글 작성
- [x] 게시글 목록 조회 (페이지네이션, 검색, 카테고리 필터링)
- [x] 게시글 상세 조회
- [x] 게시글 수정 (작성자만 가능)
- [x] 게시글 삭제 (작성자만 가능)
- [x] 댓글 목록 조회 (답글 포함)
- [x] 댓글 작성
- [x] 답글 작성
- [x] 댓글 수정 (작성자만 가능)
- [x] 스크랩 추가
- [x] 스크랩 삭제
- [x] 스크랩 목록 조회
- [ ] 댓글 삭제 (API 명세에 없음)
- [ ] 게시글 좋아요 (API 명세에 없음)
- [ ] 댓글 좋아요 (API 명세에 없음)

