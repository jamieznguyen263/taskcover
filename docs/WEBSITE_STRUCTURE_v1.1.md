# Taskcover Sitemap và cấu trúc website v1.1

Bản cấu trúc v1.1 cập nhật ngày 30/09/2026 sau khi đối chiếu website công khai và mã nguồn nhánh main của jamieznguyen263/taskcover. Giữ hướng trang chủ v3 đã duyệt và năm dịch vụ chủ lực, đồng thời bảo toàn URL hiện hữu, Pricing, các case đang có và cấu trúc Insights. Đây là đặc tả triển khai; chưa áp dụng thay đổi lên website. Mục 12 và 14 ghi rõ phần đã kiểm tra và phần còn cần xác minh.

Khuyến nghị: tổ chức website quanh ba nhu cầu của khách — hiểu dịch vụ, đánh giá bằng chứng, bắt đầu hợp tác. Taskcover là agency do chuyên gia dẫn dắt, cung cấp SEO, AI Search và Website Design & Development.

## 1 Định vị và nguyên tắc cấu trúc

Khách hàng mục tiêu gồm B2B, doanh nghiệp dịch vụ, consultant và ecommerce. Giao diện và nội dung website dùng tiếng Anh; tài liệu tư vấn này dùng tiếng Việt.

- Giữ thiết kế v3: nền sáng, tinh giản, màu Taskcover; hero tương tác, khách hàng, video thật và British Council.

- Dịch vụ chính: SEO Strategy & Consulting, Technical SEO, Content Strategy, AI Search — GEO & AEO, Website Design & Development.

- Mỗi trang phải trả lời một câu hỏi mua hàng riêng và có bước tiếp theo rõ ràng.

- Dùng case để chứng minh đúng phần việc đã thực hiện. Không lấy case SEO làm bằng chứng thiết kế website nếu chưa xác nhận phạm vi đó.

- Founder đã xác nhận Agoda, Skyscanner và British Council là dự án dưới Taskcover, với Jamiez Nguyen dẫn dắt SEO consulting.

## 2 Navigation và phân cấp

**Header:** Services · Our Work · How We Work · Insights · About · **Let’s Talk**.

| Mục | Trang đích | Trang con hoặc liên kết liên quan |
|---|---|---|
| Logo | / | Trang chủ |
| Services | /services | Năm dịch vụ chủ lực; thêm All services, Engagements và Pricing ở lớp phụ |
| Our Work | /work | Case studies, lọc theo vấn đề và năng lực |
| How We Work | /how-we-work | Cách hợp tác, vai trò, deliverables, checkpoints |
| Insights | /insights | Bài phân tích và hướng dẫn chuyên môn |
| About | /about | Người dẫn dắt, đội ngũ thật, quan điểm |
| Let’s Talk | /contact | Gửi brief ngắn; lựa chọn đặt lịch |

Engagements và Pricing đặt trong menu Services, How We Work và footer. Engagements giải thích hình thức phối hợp; Pricing giải thích mức đầu tư và phạm vi gói. Book a Call nằm ở Contact và footer. Mobile giữ nguyên tên gọi và phân cấp, mở nhóm Services bằng thao tác chạm.

Không đưa GEO, AEO, Industries, Markets, Pricing, Methodology và Proof thành các mục ngang hàng cạnh tranh trên header.

## 3 Sitemap nhóm dịch vụ

| Trang | URL giữ lại | Câu hỏi cần trả lời | Đầu ra cần thể hiện |
|---|---|---|---|
| Home | / | Taskcover phù hợp với tôi thế nào? | Trải nghiệm v3 và các lối khám phá |
| Services | /services | Tôi cần loại hỗ trợ nào? | Bản đồ vấn đề → dịch vụ → phạm vi |
| SEO Strategy & Consulting | /services/seo-agency | Nên làm gì trước và vì sao? | Query–page map, ưu tiên, kế hoạch hành động |
| Technical SEO | /services/technical-seo | Vấn đề kỹ thuật nào cần xử lý và kiểm chứng? | Chẩn đoán, yêu cầu triển khai, verification |
| Content Strategy | /services/content-marketing | Cần nội dung và loại trang nào? | Intent map, vai trò trang, content brief |
| AI Search — GEO & AEO | /services/ai-search-optimization | Theo dõi và cải thiện sự hiện diện trong AI search thế nào? | Framework theo hành trình, quan sát nguồn và phương pháp đo |
| Website Design & Development | /services/website-development | Làm sao xây website giúp khách hiểu và chọn doanh nghiệp? | Cấu trúc, trải nghiệm responsive, quyết định thiết kế và bàn giao |

Năm URL dịch vụ trên đã có trên website và trong nguồn dữ liệu dịch vụ. Đổi nhãn, nội dung và trải nghiệm tại URL hiện có; không tạo URL mới chỉ để khớp tên menu. Bảy dịch vụ còn lại được giữ trong danh mục mở rộng ở mục 14, không mặc định xóa khi rút gọn header.

AI Search dùng một trang chính cho GEO/AEO. Các chủ đề chuyên sâu có thể nằm trong Insights; chưa cần hai trang dịch vụ có nội dung gần nhau.

## 4 Sitemap nhóm case study

Our Work tại **/work** là trang tuyển chọn bằng chứng; **/work/case-studies** giữ vai trò thư viện case đầy đủ. Giữ mẫu **/work/case-studies/[slug]**. Hai hub cần nội dung và vai trò riêng: trang tuyển chọn giúp chọn câu chuyện phù hợp, thư viện hỗ trợ duyệt toàn bộ.

| Case | URL đề xuất | Vai trò trong câu chuyện |
|---|---|---|
| British Council | /work/case-studies/british-council | Phân tích rộng → ưu tiên rõ → framework AI visibility |
| Skyscanner Search Intelligence | /work/case-studies/skyscanner-vietnam | Hiểu nhu cầu và hiệu suất tìm kiếm ở quy mô lớn |
| Skyscanner Technical Diagnosis | /work/case-studies/skyscanner-serp-price-caching | Giá cũ trên SERP → Edge CDN caching → yêu cầu sửa → kiểm chứng |
| Agoda | /work/case-studies/agoda | Search consulting trong travel và destination demand |
| CCleaner | /work/case-studies/ccleaner | Localisation và software discovery |
| FWD | /work/case-studies/fwd-insurance | Nội dung rõ ràng và search discovery |
| BUV | /work/case-studies/british-university-vietnam | Tìm kiếm giáo dục, chương trình học và technical access |
| NovaWorld | /work/case-studies/novaworld | Khả năng được tìm thấy và cấu trúc nội dung bất động sản |

Skyscanner có hai câu chuyện vì hai năng lực và nhóm bằng chứng khác nhau. Không gộp số liệu portfolio với case sửa cache thành một kết quả tăng trưởng.

Ưu tiên biên tập sâu British Council, hai case Skyscanner và Agoda. British Council và hai case Skyscanner chưa có trong registry case của nhánh main đã đọc; đây là ba trang cần bổ sung theo bằng chứng đã cung cấp trong phiên. Giữ mười case hiện có, trong đó năm case chưa nằm trong danh sách nổi bật v1 là Casa Madera, The Bamboo Bar, Matthew Jeffery Law Firm, SkatePro và Avis. Không xóa hoặc noindex case chỉ vì không được chọn lên Home; review nội dung và số liệu riêng.

Bộ lọc trong Our Work: **năng lực** và **vấn đề** là chính; ngành là phụ. Ví dụ: Prioritisation, Technical Diagnosis, Content & Intent, AI Visibility. Không tự sinh hàng loạt URL cho mọi tổ hợp bộ lọc.

## 5 Các trang xây dựng niềm tin và chuyển đổi

| Trang | URL | Nội dung bắt buộc |
|---|---|---|
| How We Work | /how-we-work | Các giai đoạn hợp tác, Taskcover làm gì, khách tham gia lúc nào, đầu ra, điểm duyệt và cách kiểm chứng |
| Ways to Work Together | /engagements | Hình thức hợp tác, tình huống phù hợp, phạm vi, yếu tố quyết định mức đầu tư |
| Pricing | /pricing | Giữ trang giá hiện có; đối chiếu gói, phạm vi và CTA trước khi sửa nội dung thương mại |
| About | /about | Jamiez Nguyen, vai trò thật của đội ngũ, kinh nghiệm và quan điểm chuyên môn |
| Insights | /insights | Thư viện phân tích, lọc theo chủ đề |
| Insight detail | /insights/[categorySlug]/[articleSlug] | Tác giả, ngày xuất bản/cập nhật, nội dung, nguồn khi cần, case/dịch vụ liên quan |
| Contact | /contact | Website, mục tiêu, bối cảnh đã chọn có thể sửa; lựa chọn gửi brief hoặc đặt lịch |
| Book a Call | /book-a-call | Luồng đặt lịch thực sự, thông tin cần chuẩn bị |
| Confirmation | /thank-you | Xác nhận đúng hành động đã hoàn tất và bước tiếp theo |

Engagements là trang mới đề xuất, mô tả ba hình thức phối hợp: dự án đánh giá/chiến lược; tư vấn và hỗ trợ triển khai liên tục; dự án website. Pricing hiện đã công bố các gói và phạm vi, nên giữ trang này riêng và không tự thay giá hoặc điều khoản trong đợt sửa kiến trúc. Không lặp toàn bộ bảng giá ở Engagements; dẫn khách sang Pricing khi cần xem mức đầu tư.

Không hiển thị “đã nhận yêu cầu” khi người dùng mới tạo brief cục bộ. Website thật chỉ xác nhận thành công sau khi hệ thống tiếp nhận trả kết quả thành công.

## 6 Cấu trúc trang chủ hoàn chỉnh

| Thứ tự | Section | Mục đích | Đi tiếp tới |
|---|---|---|---|
| 1 | Hero và Decision Studio | Khách trải nghiệm Find → Trust → Choose trong ba nhóm doanh nghiệp | Dịch vụ hoặc brief có bối cảnh |
| 2 | Selected client work | Thể hiện độ rộng kinh nghiệm | Case phù hợp |
| 3 | Meet Taskcover | Video giới thiệu hiện tại | About hoặc Contact |
| 4 | British Council | Chứng minh khả năng biến phân tích thành ưu tiên | Case British Council |
| 5 | Where we can help | Năm dịch vụ, nêu vấn đề và đầu ra; Website Design có visual nổi bật trong phần này | Trang dịch vụ |
| 6 | Skyscanner technical | Chứng minh chiều sâu chẩn đoán và kiểm chứng | Case kỹ thuật và Technical SEO |
| 7 | People and partnership | Ai dẫn dắt, cách phối hợp và vai trò của khách | About và How We Work |
| 8 | Ways to work together | Các hình thức hợp tác và cách xác định phạm vi | Engagements |
| 9 | Start a useful conversation | Gửi bối cảnh hoặc đặt lịch | Contact hoặc Book a Call |

Bốn phần đầu giữ hướng v3 đã duyệt. Mỗi section có bố cục riêng. Không thêm một bảng hỏi “chọn vấn đề” thứ hai lặp lại Decision Studio. Trang chủ giới thiệu chiều sâu; các trang con chứa nội dung đầy đủ.

## 7 Cấu trúc nội dung từng loại trang

**Trang dịch vụ:** tình huống khách gặp → phạm vi → đầu ra mẫu → bằng chứng → cách phối hợp → cách kiểm chứng → FAQ và giới hạn → CTA theo nhu cầu.

**Trang case:** bối cảnh → vấn đề → vai trò Taskcover → phân tích → quyết định → trách nhiệm triển khai → bằng chứng/kết quả → giới hạn → ý nghĩa đối với doanh nghiệp tương tự → dịch vụ liên quan.

**How We Work:** hiểu bối cảnh → thống nhất phạm vi → phân tích và đề xuất → phối hợp triển khai → kiểm chứng và review. Trang hiện có đã giải thích quy trình hợp tác. Giữ /methodology ở lớp liên kết phụ để giải thích cách phân tích; chỉ gộp khi nội dung và nhu cầu thực sự trùng, không gộp mặc định vì cả hai cùng nói về cách làm.

**Website Design & Development:** bài toán người mua → cấu trúc website → trải nghiệm desktop/mobile → logic thiết kế → build và kiểm tra → bàn giao. Nếu chưa có case thiết kế thật được duyệt, dùng mẫu minh họa được ghi rõ thay vì gắn thương hiệu khách SEO vào dự án thiết kế.

**Contact:** một brief ngắn, câu hỏi giữ lại từ trải nghiệm, khả năng sửa bối cảnh và lựa chọn đặt lịch. Không yêu cầu thông tin dài trước khi khách hiểu lý do cần cung cấp.

## 8 Đường đi chính của khách

| Người dùng | Hành trình đề xuất |
|---|---|
| Founder | Home → dịch vụ hoặc engagement → case liên quan → Contact |
| SEO hoặc Marketing Lead | Technical/Strategy hoặc Insight → case chuyên sâu → How We Work → Contact |
| Khách cần website | Website Design & Development → mẫu responsive và quyết định thiết kế → engagement → brief |
| Khách được giới thiệu | About/Work hoặc đi thẳng Contact/Book a Call |

Liên kết hai chiều giữa dịch vụ và case phù hợp. Mỗi bài Insight chỉ dẫn tới dịch vụ/case liên quan thực sự. Footer giúp người đọc tìm lại Services, Work, How We Work, About, Engagements và Contact.

Ngữ cảnh từ Decision Studio chỉ gồm lựa chọn và câu hỏi người dùng chủ động giữ lại; hiển thị để họ sửa trước khi gửi.

## 9 Nhóm doanh nghiệp và trang mở rộng

Ban đầu dùng ba nhóm **B2B**, **Services & Consulting**, **Ecommerce** trong Home và Services. Consultants nằm trong nhóm dịch vụ.

Các trang mở rộng có điều kiện:

| Trang | URL dự kiến | Điều kiện mở |
|---|---|---|
| B2B | /solutions/b2b | Phạm vi, tình huống, câu hỏi mua hàng và bằng chứng riêng |
| Service businesses | /solutions/service-businesses | Nội dung chuyên biệt về dịch vụ/consulting |
| Ecommerce | /solutions/ecommerce | Nội dung chuyên biệt về sản phẩm, technical và hành trình mua |

Đây chưa phải nhóm trang bắt buộc trong header hoặc scope build đầu tiên. Không nhân bản mọi tổ hợp dịch vụ × ngành × quốc gia.

Những trang Industries/Markets đã tồn tại cần được kiểm tra từng trang; chưa được phép suy ra rằng tất cả phải xóa hoặc chuyển hướng.

## 10 Footer hệ thống và ngôn ngữ

| Nhóm | Trang hoặc route | Cách xử lý |
|---|---|---|
| Chính sách | /privacy-policy, /terms, /cookie-policy | Giữ và đối chiếu với hoạt động, tích hợp thật |
| Tiện ích | /cookie-preferences, /accessibility, /data-request | Chức năng và nội dung phải khớp quy trình thực tế |
| Flow | /flow và các trang con | Khu vực làm việc có feature flag, session và phân quyền trong mã nguồn; bảo toàn ngoài sitemap marketing |
| Admin | /admin và các trang con | Xác thực; không trong navigation hoặc XML sitemap công khai |
| Kỹ thuật | /api/*, /sitemap.xml, /robots.txt | Hạ tầng, không phải trang marketing |
| Lỗi và trạng thái | 404, /thank-you, preview/draft | 404 hữu ích; không index trang xác nhận/preview; bảo vệ tài liệu không công khai bằng kiểm soát truy cập |

Đã xác nhận nguồn i18n có ba ngôn ngữ: English không prefix, French /fr và Spanish /es; cây route có bản địa hóa. Giữ cấu trúc này. Chưa kiểm tra đầy đủ nội dung và hành vi live của từng bản dịch. Trang mới chỉ bổ sung alternate tương ứng khi bản dịch thực sự sẵn sàng; kiểm tra sitemap và chuyển ngôn ngữ theo từng URL.

Kiến trúc này không tự xác lập điều khoản pháp lý hay nghĩa vụ mới.

## 11 Mô hình quản trị nội dung

| Loại nội dung | Trường cốt lõi |
|---|---|
| Service | Tên, vấn đề, đối tượng, scope, deliverables, client inputs, verification, FAQ, case liên quan, CTA |
| Case | Client, ngành, thị trường, thời gian nếu có, scope, consultant role, client-team role, hành động, deliverables, metrics, nguồn, asset và trạng thái biên tập |
| Insight | Chủ đề, tác giả, ngày, nội dung, nguồn, liên kết liên quan |
| Person | Tên, chức danh thật, ảnh, chuyên môn, phạm vi trách nhiệm |
| Engagement | Tình huống phù hợp, phạm vi, đầu ra, yếu tố thương mại đã duyệt |

Với từng metric, lưu định nghĩa, đơn vị, kỳ đo, baseline/denominator khi có, nguồn và loại claim: quy mô phân tích; khuyến nghị; thay đổi quan sát; triển khai được kiểm chứng; kết quả có căn cứ về đóng góp. Không trộn các loại này.

British Council: 21.323 quan hệ query–page, 995 URL, 1,66M impressions, 10.277 clicks, 989 cơ hội, 32 ưu tiên cao + 26 trung bình, 288 prompt. Không tự tạo action list hoặc scoring criteria chưa có.

Skyscanner: portfolio 20,6M impressions và 398,5K clicks; 1,9% CTR, vị trí trung bình 7,34. Mức tăng clicks 9,5% với impressions so sánh gần 4,7M thuộc phạm vi so sánh riêng; không gộp với portfolio hoặc case cache. Platform team thực hiện bản sửa; Taskcover chẩn đoán, xác định yêu cầu và kiểm chứng.

## 12 Rà soát URL cũ trước khi chuyển cấu trúc

| Route hoặc nhóm hiện có | Quyết định cấu trúc v1.1 | Trạng thái và điều kiện |
|---|---|---|
| Năm URL dịch vụ chủ lực ở mục 3 | Giữ URL, viết sâu và thiết kế lại | Đã thấy link công khai và nguồn dữ liệu |
| Bảy dịch vụ mở rộng | Giữ URL và lối truy cập từ Services | Có trong nguồn; phạm vi từng dịch vụ review riêng |
| /work | Giữ, chuyển thành tuyển chọn case | Đã đọc trang công khai |
| /work/case-studies và mười case | Giữ thư viện và URL chi tiết | Registry đã đọc; xem mục 14 |
| /work/sample-audits và trang con | Giữ thư viện mẫu, liên kết từ dịch vụ | Trang công khai mô tả mẫu minh họa; không coi là kết quả khách hàng |
| /work/search-growth-frameworks | Giữ URL trong lúc biên tập lại | Có route và trang công khai; phân biệt với Methodology |
| /work/client-results | Ứng viên gộp phần bằng chứng vào Work | Chưa áp dụng redirect; cần xác minh toàn bộ nội dung và giá trị URL |
| /proof và các trang con | Review theo loại bằng chứng; bỏ khỏi header chính | Không gộp hàng loạt; giữ nội dung riêng hữu ích |
| /methodology | Giữ làm trang phụ của How We Work | Phương pháp phân tích khác quy trình hợp tác |
| /flow/* | Bảo toàn khu vực làm việc | Layout nguồn có session, access gate và noindex |
| /pricing | Giữ trang giá riêng | Có giá và phạm vi công khai; không redirect sang Engagements |
| /free-seo-audit | Giữ đường vào offer hiện có | Cần kiểm tra form, cam kết và xử lý lead trước khi phát hành bản mới |
| /industries/* và /markets/* | Giữ URL, chuyển ra điều hướng phụ | Chưa có dữ liệu traffic/backlink để quyết định gộp |
| /insights/[categorySlug]/[articleSlug] | Giữ nguyên cấu trúc | Cây route và sitemap generator đã xác nhận |
| /fr/* và /es/* | Bảo toàn cấu trúc ngôn ngữ | Cần QA bản dịch, metadata, form và alternate |
| /engagements | Tạo mới | Chưa thấy route trong cây main; vai trò đã xác định ở mục 5 |

Bảng trên là quyết định biên tập và bảo toàn route cho đợt triển khai, chưa phải redirect manifest. Đợt đầu không cần chuyển hướng năm dịch vụ chủ lực, Pricing hoặc Insights. Mọi ứng viên gộp chỉ chuyển hướng sau khi đã kiểm tra URL nguồn, trang đích tương đương, liên kết, dữ liệu sử dụng và nội dung cần giữ. Chưa có dữ liệu GSC, analytics hoặc backlink trong lần đối chiếu này.

## 13 Thứ tự triển khai và điều kiện hoàn tất

1. Chốt sitemap và vai trò từng trang trong bản này.

2. Dùng inventory nguồn và đối chiếu công khai tại mục 14 để triển khai; khi môi trường cục bộ khôi phục, so sánh với thay đổi chưa push và hoàn tất kiểm tra HTTP, canonical, sitemap, internal links.

3. Hoàn thiện các section còn lại của Home theo v3.

4. Làm Services hub, năm service pages và các case chủ lực.

5. Hoàn thiện About, How We Work, Engagements, Pricing, Contact và booking; giữ giá và điều khoản đang có cho đến khi được sửa có chủ đích.

6. Review case hỗ trợ, policy/utility, ngôn ngữ và nội dung Insights.

7. Tích hợp vào hệ thống thật và kiểm tra browser, mobile, bàn phím, màu, motion, video, SEO và nhận lead.

Điều kiện hoàn tất: trang có mục tiêu riêng, nội dung đủ, chủ sở hữu, bằng chứng phù hợp và bước tiếp theo; dịch vụ/case được liên kết đúng; form/booking có xác nhận thật; không còn trang rỗng hay CTA không hoạt động.

**Trạng thái thực hiện:** đã đọc website công khai, cây route GitHub và các nguồn dịch vụ, case, ngôn ngữ, sitemap, robots, Flow. Chưa truy cập lại được mã nguồn cục bộ do lỗi khởi tạo sandbox; nhánh main có thể thiếu prototype hoặc sửa đổi chưa push. Công cụ web chưa lấy được sitemap.xml và robots.txt công khai, nên không kết luận hai endpoint bị lỗi. Chưa sửa repo, route, XML sitemap, redirect hoặc production. Page đã được cập nhật; chưa kiểm tra preview trực quan của Page.

## 14 Inventory và gói triển khai

Đối chiếu ngày 30/09/2026. Nguồn: [website công khai](https://taskcover.com/), [cây mã nguồn main](https://github.com/jamieznguyen263/taskcover/tree/main/src/app), [dữ liệu dịch vụ](https://github.com/jamieznguyen263/taskcover/blob/main/src/data/services.ts), [case registry](https://github.com/jamieznguyen263/taskcover/blob/main/src/content/en/case-studies.ts), [sitemap generator](https://github.com/jamieznguyen263/taskcover/blob/main/src/lib/sitemap.ts), [ngôn ngữ](https://github.com/jamieznguyen263/taskcover/blob/main/src/lib/i18n.ts), [Flow layout](https://github.com/jamieznguyen263/taskcover/blob/main/src/app/flow/layout.tsx). Snapshot cây GitHub trả về tree SHA 6371d4914051b745570a9b56e167b6fad7e2fa89; các file được đọc từ main trong phiên này. Đây là inventory route và nội dung nguồn, không phải crawl hoàn chỉnh hay bằng chứng mọi trang đang được index.

### Danh mục dịch vụ cần bảo toàn

| Vai trò | URL | Hành động |
|---|---|---|
| Chủ lực | /services/seo-agency | Làm rõ chiến lược, tư vấn, ưu tiên và roadmap |
| Chủ lực | /services/technical-seo | Đào sâu chẩn đoán, yêu cầu sửa và kiểm chứng |
| Chủ lực | /services/content-marketing | Đặt Content Strategy làm trọng tâm; nói rõ phạm vi sản xuất |
| Chủ lực | /services/ai-search-optimization | Một trang cho GEO/AEO; framework đo và giới hạn |
| Chủ lực | /services/website-development | Thể hiện thiết kế và phát triển; có trải nghiệm desktop/mobile |
| Mở rộng | /services/digital-pr-link-building | Giữ URL; liên kết với nội dung và authority khi phù hợp |
| Mở rộng | /services/local-seo | Giữ; nhu cầu địa phương và nhiều địa điểm |
| Mở rộng | /services/ecommerce-seo | Giữ; phân biệt với trang ngành ecommerce |
| Mở rộng | /services/international-seo | Giữ; nhu cầu nhiều thị trường và ngôn ngữ |
| Mở rộng | /services/ppc-management | Giữ phạm vi dịch vụ hiện có; không ép thành SEO |
| Mở rộng | /services/seo-mentor-service | Giữ; liên kết từ tư vấn và hình thức hợp tác |
| Mở rộng | /services/seo-audit | Giữ; phân biệt scope audit với offer miễn phí |

Năm mục chủ lực xuất hiện trước trong menu. Services hub chứa cả danh mục mở rộng bằng danh sách dễ quét; không cần biến cả 12 dịch vụ thành 12 thẻ giống nhau.

### Case và thư viện mẫu

| Nhóm | Slug dưới /work/case-studies/ | Hành động |
|---|---|---|
| Case hiện có được ưu tiên | agoda | Biên tập sâu, giữ URL |
| Case hiện có tiếp tục giữ | british-university-vietnam, novaworld, ccleaner, fwd-insurance | Kiểm tra từng claim khi đưa vào thiết kế mới |
| Case hiện có ngoài tuyển chọn Home | casa-madera, the-bamboo-bar, matthew-jeffery-law-firm, skatepro, avis | Giữ trong thư viện, không tự loại bỏ |
| Case bổ sung | british-council | Xây mới từ bằng chứng đã cung cấp |
| Case bổ sung | skyscanner-vietnam | Xây mới cho câu chuyện phân tích tìm kiếm |
| Case bổ sung | skyscanner-serp-price-caching | Xây mới cho câu chuyện kỹ thuật |

Nhánh main có 10 case; sitemap mới bổ sung 3, thành 13 URL case đích nếu cả ba được hoàn thiện. Đây là số trang case, không phải số khách hàng duy nhất.

Tám slug mẫu trong nguồn, dưới /work/sample-audits/: technical-seo-audit, ai-search-visibility-review, content-gap-map, local-seo-audit, ecommerce-search-architecture, international-seo-market-map, ppc-organic-intelligence, 90-day-search-growth-roadmap. Giữ nhãn minh họa. Decision Studio có thể dẫn sang một mẫu liên quan để người đọc xem sâu; không sao chép cùng trải nghiệm vào mọi trang.

### Các nhóm còn lại

| Nhóm | URL hoặc slug nguồn | Xử lý |
|---|---|---|
| Ngành | /industries/travel-seo, education-seo, healthcare-seo, legal-immigration-seo, saas-seo, ecommerce-seo, franchise-local-seo | Các slug sau dấu phẩy cùng nằm dưới /industries/; giữ 7 trang và hub |
| Thị trường | /markets/usa-seo-agency, /markets/canada-seo-agency, /markets/australia-seo-agency | Giữ 3 trang và hub; không nhân bản thêm |
| Insights categories | seo-guides, ai-search, technical-seo, content-authority, local-international-seo, ppc-search-intelligence, seo-mentor | Giữ 7 category dưới /insights/; bài viết giữ category trong URL |
| Proof detail | brand-experience, media-features, client-reviews, video-reviews, spokesperson | Có kiểu dữ liệu/route dưới /proof/; review nội dung trước khi giữ riêng hay gộp |
| Công ty | /about, /how-we-work, /methodology | Giữ; phân biệt con người, hợp tác, phương pháp |
| Thương mại | /pricing, /free-seo-audit, /contact, /book-a-call | Giữ URL và ý định riêng |
| Tiện ích | /privacy-policy, /terms, /cookie-policy, /cookie-preferences, /accessibility, /data-request, /thank-you | Giữ theo chức năng hiện có; xác nhận thành công phải phản ánh giao dịch thật |
| Nội bộ | /admin/*, /flow/*, /api/* | Bảo toàn chức năng và kiểm soát truy cập, ngoài điều hướng marketing |

Số lượng bài Insights xuất bản và dữ liệu CMS động chưa được kiểm kê trong lần này. Không dùng số file route làm số lượng trang live.

### Cấu trúc menu và footer để triển khai

Header: logo → Home; Services → hub với năm dịch vụ chủ lực, All services, Engagements, Pricing; Our Work → tuyển chọn case, Case Studies, Sample Deliverables; How We Work; Insights; About; CTA Let’s Talk.

Footer chia nhóm: Services; Work; Company & Working Together; Industries & Markets; Policies. Các trang mở rộng vẫn có đường vào qua hub và liên kết ngữ cảnh. Header và footer lấy dữ liệu điều hướng thống nhất; bản mobile giữ đầy đủ đường đi bằng thao tác chạm, không phụ thuộc hover.

Breadcrumb giữ theo URL: Home → Services → service; Home → Work → Case Studies → case; Home → Insights → category → article. Khi mở trang trực tiếp vẫn phải hiểu vị trí của nó.

### Gói triển khai theo thứ tự

| Gói | Công việc cụ thể | Điều kiện hoàn tất |
|---|---|---|
| A Cấu trúc và màu | Header/footer mới; thống nhất tên dịch vụ và URL; màu nền, chữ, CTA, hover, focus và selected theo brand | Link đến URL có thật; desktop/mobile cùng phân cấp; trạng thái màu rõ và đọc được |
| B Trang chủ | Tích hợp v3 đã duyệt, hoàn thiện section 5–9 và đường đi từ Decision Studio | Lựa chọn dẫn tới dịch vụ/brief đúng ngữ cảnh; video và dialog hoạt động |
| C Dịch vụ | Services hub và năm trang chủ lực; bảo toàn bảy trang mở rộng | Mỗi trang có scope, đầu ra, ví dụ, bằng chứng phù hợp và CTA riêng |
| D Bằng chứng | Work, Case Studies, ba case bổ sung và biên tập Agoda | Giữ mười URL case cũ; không trộn dữ liệu giữa hai câu chuyện Skyscanner |
| E Hợp tác | About, How We Work, Methodology, Engagements, Pricing | Vai trò từng trang rõ, liên kết hai chiều; giá/điều khoản không bị thay ngầm |
| F Chuyển đổi | Contact, booking, free audit và trạng thái xác nhận | Giữ dữ liệu người dùng khi lỗi; chỉ xác nhận gửi/đặt lịch sau phản hồi thành công thật |
| G Phát hành | Kiểm tra URL, metadata, locales, màu, bàn phím, mobile, API lead và luồng nội bộ có liên quan | Có bằng chứng kiểm tra trên bản build; xử lý mọi mapping được thay đổi trước publish |

A và B là gói tiếp theo để lập trình sau khi khôi phục workspace. Trong lần này chỉ hoàn thiện kiến trúc và kế hoạch; chưa chạy build hoặc sửa production.

### Những việc còn cần xác minh

- So sánh nhánh main với prototype v3 và thay đổi chưa push trong workspace.

- Đọc runtime sitemap.xml, robots.txt, HTTP status, canonical, hreflang và liên kết thực tế.

- Đối chiếu nguồn bài viết từ CMS/database với sitemap generator đang dùng localInsightsProvider; đây là điểm cần kiểm tra, chưa kết luận bài nào bị thiếu.

- Kiểm tra lastModified trong sitemap: nguồn đang mặc định thời điểm tạo response; cần đối chiếu với ngày cập nhật nội dung khi triển khai.

- Có dữ liệu GSC/analytics/backlink trước khi quyết định bỏ hoặc gộp URL. Chưa có các dữ liệu này nên giữ route là mặc định.

- Kiểm tra nhận lead, booking, đa ngôn ngữ và layout trực tiếp trong browser trước khi công bố.
