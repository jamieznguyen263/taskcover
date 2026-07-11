# Hướng Dẫn Staff Sử Dụng Blog Editor Taskcover

Tài liệu này là quy trình làm việc cho staff khi tạo, review và publish bài blog/insight trên Taskcover. Mục tiêu là tạo bài viết hữu ích, có bằng chứng, dễ đọc, dễ crawl, có cấu trúc tốt cho SEO/GEO và sẵn sàng cho review nghiêm túc.

Blog editor không thể đảm bảo top 10 Google. Editor giúp staff không publish bài thiếu chiến lược, thiếu bằng chứng, thiếu internal link, thiếu schema, hoặc thiếu tín hiệu localization.

## 1. Tạo Bài Và Chọn Locale

1. Vào `Admin > Insights > New`.
2. Tạo shared slug bằng tiếng Anh, lowercase kebab-case.
3. Mở từng locale EN, FR, ES nếu bài cần publish đa ngôn ngữ.
4. Không publish khi locale còn `needs-review`, trừ khi admin chủ động chấp nhận rủi ro.

## 2. Hoàn Thiện Search Strategy Trước Khi Viết

Tab `Search Strategy` là brief bắt buộc. Trước khi viết body, điền:

- `Primary keyword / query`: một query chính bài này cần thắng.
- `Core question`: câu hỏi chính bài viết phải trả lời.
- `Target audience`: ai đọc bài này, vai trò gì, nhu cầu gì.
- `Target markets`: USA, Canada, Australia hoặc thị trường cụ thể của bài.
- `SERP observations`: ít nhất 3 ghi chú về trang đang rank, format, angle và khoảng trống nội dung.
- `Unique information gain`: Taskcover thêm gì mới mà đối thủ chưa có.
- `AI citation opportunity`: đoạn, framework hoặc fact nào đáng để AI Overview hoặc AI Mode trích dẫn.
- `Primary entity` và `Required entities`: các thực thể phải xuất hiện rõ trong body.

Nếu thiếu primary query, core question hoặc target audience, Publish QA sẽ chặn publish.

## 3. Viết Body Trong Document

Dùng editor theo workflow giống Notion/Docs:

- Gõ `/` để chèn block nhanh.
- Dùng H2/H3 để tạo outline rõ.
- Đặt `Direct answer` trong 3 block đầu tiên.
- Thêm `Key takeaways` gần đầu bài nếu bài dài.
- Dùng `Definition`, `Checklist`, `Steps`, `Comparison table`, `Statistic`, `FAQ`, `Pros & cons` khi chúng thật sự giúp người đọc.
- Chèn internal link trực tiếp trong body, không chỉ khai báo ở tab Internal Linking.
- Luôn dùng `Show rendered preview` để xem bài public render ra sao.

Link inline, bold, italic và inline code sẽ được save và render ra public article. Nếu link required đã khai báo nhưng chưa nằm trong body, Publish QA sẽ chặn.

## 4. Dùng Content Intelligence Trước Khi Review

Tab `Content Intelligence` là checklist thông minh trước Publish QA. Xử lý theo thứ tự:

1. `Needs action`: bắt buộc sửa trước khi review.
2. `Watch items`: nên sửa để bài mạnh hơn.
3. `Passed`: đã đạt.

Mỗi dòng có nút `Fix` để nhảy sang tab cần sửa. Content Intelligence kiểm tra:

- Search strategy có query, question, audience, market, SERP gap và information gain.
- Body có độ sâu, H2, direct answer, key takeaways, FAQ/question headings và structured blocks.
- GEO có primary/supporting entities trong body.
- Evidence có claims, sources, independent sources và source cho statistics.
- Internal links có planned links và body links thật.
- Metadata/schema có meta title, description, robots, cover alt và about entities.
- Localization có đủ locale, translation status và locale keyword.

Đây không phải điểm ranking. Đây là công cụ giúp staff không bỏ sót việc quan trọng.

## 5. Quản Lý Evidence Và Claims

Tab `Content & Evidence` dùng để ghi lại bằng chứng:

- Thêm mỗi factual claim quan trọng.
- Nếu claim cần bằng chứng, bật `requiresEvidence`.
- Thêm source thật, có publisher, URL, accessed date và published date nếu có.
- Link claim với source.
- Dùng independent sources cho claim quan trọng; first-party source không đủ cho mọi tình huống.
- Không thêm số liệu, quote, awards hoặc expert nếu không có source thật.

Nếu claim requires evidence nhưng không có source, Publish QA sẽ chặn publish.

## 6. Internal Linking

Tab `Internal Linking` dùng để plan link, nhưng link phải được chèn vào body.

Tối thiểu nên có:

- 1 link conversion phù hợp: `/free-seo-audit` hoặc `/book-a-call`.
- 1 link service, industry hoặc market liên quan.
- 1 link article hỗ trợ nếu có.

Nếu link nằm trong `Required internal links`, staff phải chèn link đó vào body bằng bubble link menu hoặc structured reference block.

## 7. Metadata & Social

Tab `Metadata & Social` kiểm soát search snippet:

- SEO title: rõ intent, không clickbait.
- Meta description: hữu ích, đúng intent.
- Slug: lowercase kebab-case.
- Canonical: đúng đường dẫn article, trừ khi có lý do consolidate duplicate.
- Robots: `index,follow` trước publish.
- Author và Expert reviewer: dùng người thật.
- Cover image alt: bắt buộc.
- Social image/title/description: nên có để chia sẻ đẹp.

Google có thể rewrite title/description; preview chỉ là ước tính.

## 8. Schema

Tab `Schema` chỉ mô tả những gì có thật trên page:

- Chọn `Article` hoặc `BlogPosting`.
- Thêm about entities và mentioned entities.
- Import citation URLs từ Evidence.
- FAQ schema phải sync với FAQ block trong body.
- Không tạo fake review, fake aggregate rating, fake person hoặc fake award.

## 9. GEO

Tab `GEO` kiểm tra khả năng bài viết dễ được trích dẫn:

- Direct answer gần đầu bài.
- Definition, Key takeaways, FAQ.
- Question-based headings.
- Structured evidence blocks.
- Entity coverage.
- Citation readiness.

Không có tool nào đảm bảo AI citation. Mục tiêu là làm nội dung dễ đọc, dễ trích dẫn và có bằng chứng rõ ràng.

## 10. Localization

Mỗi locale cần được review riêng:

- Slug có phù hợp ngôn ngữ/thị trường không.
- SEO title/meta description có bản địa hóa không.
- Locale-specific keyword không nên là dịch thẳng.
- Ví dụ, entity và market context có đúng USA/Canada/Australia hoặc locale mục tiêu không.
- Translation status phải là `complete` trước publish.

## 11. Publish QA Và Workflow

Trước khi submit review:

1. `Save now`.
2. Mở `Content Intelligence` và sửa tất cả `Needs action`.
3. Mở `Publish QA` và sửa tất cả blocking errors.
4. Preview public rendering.
5. Submit for review.

Admin review:

1. Đọc body và preview.
2. Kiểm tra Evidence, Links, Schema, Localization.
3. Nếu cần sửa, dùng comment/change request.
4. Khi ready, approve.
5. Publish now hoặc schedule.

Không publish nếu:

- Thiếu H1, meta title hoặc meta description.
- Robots là noindex.
- Thiếu cover alt.
- FAQ schema mismatch.
- Claim cần evidence nhưng không có source.
- Required internal links chưa nằm trong body.
- Search strategy thiếu primary query, core question hoặc target audience.

## 12. Sau Khi Publish

Sau publish, theo dõi:

- Google Search Console indexing và queries.
- CTR title/meta.
- Pages có cannibalization.
- Internal links vào/ra.
- Content decay và refresh trigger.
- Thay đổi trong SERP/AI Overview.

Khi có dữ liệu mới, tạo revision mới thay vì sửa tùy tiện trên bản published.
