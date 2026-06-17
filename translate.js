const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const siteDir = path.join(__dirname, 'site');

// Comprehensive Vietnamese -> English translation map
// Sorted by length (longer first) to avoid partial matches
const translationMap = [
  // Page titles
  ["Dao.Design -  Studio chuyên thực hiện các dự án kỹ thuật số chất lượng cao.", "Dao.Design - Studio specializing in high-quality digital projects."],
  ["Về Dao.Design", "About Dao.Design"],
  ["Liên hệ với chúng tôi", "Contact Us"],
  ["Dự án  - Tâm huyết", "Projects - Our Passion"],

  // Navigation
  ["Trang Chủ", "Home"],
  ["Trang chủ", "Home"],
  ["trang chủ", "home"],
  ["Giới Thiệu", "About"],
  ["Giới thiệu", "About"],
  ["giới thiệu", "about"],
  ["Dự Án", "Projects"],
  ["Dự án", "Projects"],
  ["dự án", "projects"],
  ["Liên Hệ", "Contact"],
  ["kết nối", "connect"],

  // Hero section
  ["Cùng thương hiệu tối ưu hóa tỷ lệ chuyển đổi và kiến tạo trải nghiệm số đáng nhớ.", "Partnering with brands to optimize conversion rates and create memorable digital experiences."],
  ["Nhận Diện Thương Hiệu", "Brand Identity"],
  ["Nhận diện thương hiệu", "Brand Identity"],
  ["nhận diện thương hiệu", "brand identity"],
  ["Thiết Kế Website", "Website Design"],
  ["Thiết kế website", "Website Design"],
  ["thiết kế website", "website design"],
  ["Phát Triển Website", "Website Development"],
  ["Phát triển website", "Website Development"],
  ["phát triển website", "website development"],
  ["dao.design®", "dao.design®"],
  ["® về studio", "® about the studio"],

  // About section
  ["Chúng tôi là một Design Studio chuyên thực hiện các dự án kỹ thuật số chất lượng cao. Bằng việc kết hợp tư duy thẩm mỹ hiện đại với sức mạnh của các giải pháp low-code, chúng tôi kiến tạo nên những website có tính tương tác cao và trải nghiệm thị giác ấn tượng.", "We are a Design Studio specializing in high-quality digital projects. By combining modern aesthetic thinking with the power of low-code solutions, we create highly interactive websites with impressive visual experiences."],
  ["Bằng việc kết hợp tư duy thẩm mỹ hiện đại với sức mạnh của các giải pháp low-code, chúng tôi kiến tạo nên những website có tính tương tác cao và trải nghiệm thị giác ấn tượng.", "By combining modern aesthetic thinking with the power of low-code solutions, we create highly interactive websites with impressive visual experiences."],

  // Process section
  ["Quy trình thiết kế", "Design Process"],
  ["quy trình thiết kế", "design process"],
  ["Quy trình làm việc bài bản nhưng tinh gọn, tập trung hoàn toàn vào việc tạo ra những thiết kế chuyên biệt và mang lại kết quả thực tế cho doanh nghiệp", "A methodical yet streamlined workflow, focused entirely on creating distinctive designs that deliver real results for your business."],
  ["01", "01"],
  ["02", "02"],
  ["03", "03"],
  ["04", "04"],

  ["khám phá & Định hình", "Discovery & Planning"],
  ["Khám phá & Định hình", "Discovery & Planning"],
  ["Chúng tôi bắt đầu bằng việc thấu hiểu vấn đề, người dùng và mục tiêu kinh doanh cốt lõi của doanh nghiệp.", "We begin by deeply understanding the problem, users, and core business objectives."],
  ["Chúng tôi bắt đầu bằng việc lắng nghe sâu sắc — thấu hiểu tầm nhìn, những thách thức, đối tượng khách hàng và mục tiêu của bạn. Thông qua nghiên cứu, các buổi thảo luận (workshops) và những phân tích đối thủ, chúng tôi định hình một nền tảng vững chắc cho mọi bước tiếp theo.", "We start by listening deeply — understanding your vision, challenges, target audience, and goals. Through research, workshops, and competitor analysis, we shape a solid foundation for every step ahead."],

  ["Thiết kế & tinh chỉnh", "Design & Refinement"],
  ["Khi mọi thứ đã rõ ràng, chúng tôi xây dựng khung chiến lược từ cấu trúc website đến luồng người dùng để đảm bảo sự giao thoa giữa hình thức và công năng. Sau đó chuyển hóa thành giao diện trực quan (high-fidelity) với hệ thống thành phần linh hoạt, được tối ưu liên tục để đảm bảo tính đồng nhất giữa thiết kế và thương hiệu.", "Once everything is clear, we build a strategic framework from site structure to user flow, ensuring the intersection of form and function. We then transform it into high-fidelity interfaces with flexible component systems, continuously optimized for consistency between design and brand."],

  ["Kiểm thử & Triển khai", "Testing & Deployment"],
  ["Sau khi hoàn thiện thiết kế tổng thể là lúc sản phẩm được lập trình, tinh chỉnh và kiểm thử kỹ lưỡng nhằm mang lại một giải pháp số hoàn chỉnh và sẵn sàng vận hành.", "After finalizing the overall design, the product is developed, refined, and thoroughly tested to deliver a complete digital solution ready for operation."],

  ["bàn giao & đồng hành", "Handover & Partnership"],
  ["Bàn giao & đồng hành", "Handover & Partnership"],
  ["Chúng tôi chuẩn bị mọi tài nguyên để sẵn sàng thực thi, cung cấp file bàn giao trên cùng tài liệu hướng dẫn. Sự hỗ trợ của chúng tôi vẫn tiếp tục sau khi ra mắt nhằm đảm bảo quá trình vận hành mượt mà và phát triển bền vững trong tương lai.", "We prepare all resources for ready execution, providing handover files along with documentation. Our support continues after launch to ensure smooth operation and sustainable growth."],

  // Services
  ["Dịch vụ", "Services"],
  ["dịch vụ", "services"],
  ["Kiến tạo thương hiệu, thiết kế trải nghiệm số liền mạch và website tối ưu trên mọi thiết bị.", "Building brands, designing seamless digital experiences, and optimizing websites across all devices."],
  ["Kiến tạo trải nghiệm số thực sự đáng nhớ", "Creating truly memorable digital experiences"],
  ["thiết kế & phát triển website", "website design & development"],

  ["Cùng doanh nghiệp xây dựng một thương hiệu khác biệt, đáng nhớ và nhất quán. Từ đó tạo nên sự kết nối sâu sắc với khách hàng mục tiêu.", "Helping businesses build a distinctive, memorable, and consistent brand. Creating deep connections with target customers."],
  ["Cùng bạn xây dựng một thương hiệu khác biệt, đáng nhớ và nhất quán. Từ đó tạo nên sự kết nối sâu sắc với khách hàng mục tiêu.", "Helping you build a distinctive, memorable, and consistent brand. Creating deep connections with target customers."],

  ["Chúng tôi tập trung vào việc tạo ra những trải nghiệm số trực quan, lôi cuốn và lấy người dùng làm trung tâm nhằm mang lại hiệu quả thiết thực cho doanh nghiệp.", "We focus on creating intuitive, engaging, user-centered digital experiences that deliver practical results for businesses."],

  ["Giúp doanh nghiệp chuyển hóa các ý tưởng thành những giải pháp số chất lượng cao.", "Helping businesses transform ideas into high-quality digital solutions."],

  // Service sub-items
  ["Logo", "Logo"],
  ["Font chữ & Hệ màu", "Typography & Color System"],
  ["hệ màu", "color system"],
  ["Brand guidelines", "Brand Guidelines"],
  ["Art Direction", "Art Direction"],
  ["định hướng thiết kế", "design direction"],
  ["Định hướng thiết kế", "Design Direction"],
  ["Art direction", "Art Direction"],
  ["Thiết kế UI/UX", "UI/UX Design"],
  ["thiết kế UI-UX", "UI/UX design"],
  ["Landing page", "Landing Page"],
  ["Design systems", "Design Systems"],
  ["Phát triển Front-end", "Front-end Development"],
  ["Giải pháp CMS", "CMS Solutions"],
  ["→ Giải pháp CMS", "→ CMS Solutions"],
  ["Tối ưu SEO", "SEO Optimization"],
  ["→ Tối ưu SEO", "→ SEO Optimization"],
  ["Bảo trì và Cập nhật", "Maintenance & Updates"],
  ["→ Bảo trì & Cập nhật", "→ Maintenance & Updates"],

  ["→ Thiết kế Giao diện UI-UX", "→ UI-UX Interface Design"],
  ["→ Nghiên cứu & Định hướng", "→ Research & Direction"],
  ["→ Định hướng thiết kế", "→ Design Direction"],
  ["→ Thiết kế Wireframe", "→ Wireframe Design"],
  ["→ Webflow Development", "→ Webflow Development"],
  ["→ Brand Guidelines", "→ Brand Guidelines"],
  ["→ Định vị cốt lõi", "→ Core Positioning"],
  ["→ Art direction", "→ Art Direction"],
  ["→ Story telling", "→ Storytelling"],
  ["→ Design system", "→ Design System"],
  ["→ Landing page", "→ Landing Page"],
  ["→ Logo độc bản", "→ Unique Logo"],
  ["→ Font chữ & Hệ màu", "→ Typography & Color System"],
  ["→ Ứng dụng văn phòng", "→ Office Applications"],

  // Projects
  ["Dự án", "Projects"],
  ["Bộ sưu tập những sản phẩm số được chăm chút tỉ mỉ từ thiết kế đến vận hành.", "A collection of digital products meticulously crafted from design to operation."],
  ["Từ các Doanh nghiệp vừa và nhỏ, tổ chức Chính phủ đến các Đơn vị khởi nghiệp, mỗi khách hàng là một cơ hội để chúng tôi không ngừng học hỏi và phát triển bản sắc riêng", "From SMEs and Government organizations to Startups, each client is an opportunity for us to continuously learn and develop our unique identity."],

  ["Thiết kế website", "Website Design"],
  ["thiết kế ấn phẩm", "publication design"],
  ["thiết kế web app", "web app design"],
  ["tư vấn thiết kế", "design consultancy"],
  ["xem dự án", "view project"],

  // Project details
  ["Xây dựng sự hiện diện chuyên nghiệp và đầy cảm hứng cho Start-up công nghệ đang lên", "Building a professional and inspiring online presence for an emerging tech startup"],
  ["Gói trọn nét sang trọng của khách sạn Boutique vào một không gian số đầy tinh tế", "Capturing the luxury of a Boutique hotel within a refined digital space"],
  ["Định hình diện mạo trực tuyến cho đội ngũ vận hành homestay đang trên đà bứt phá", "Shaping the online presence for a homestay management team on the rise"],

  // Project detail content
  ["bối cảnh", "context"],
  ["Bối cảnh", "Context"],
  ["mục tiêu", "goal"],
  ["Mục tiêu", "Goal"],
  ["giải pháp", "solution"],
  ["Giải pháp", "Solution"],
  ["thành quả", "result"],
  ["Thành quả", "Result"],
  ["nội dung", "content"],
  ["Nội dung", "Content"],
  ["thiết kế", "design"],
  ["Thiết kế", "Design"],
  ["năm", "year"],
  ["khác", "other"],
  ["khách hàng", "client"],
  ["Khách hàng", "Client"],
  ["Tất cả", "All"],

  // Testimonials
  ["Phản hồi từ khách hàng", "Client Testimonials"],
  ["đánh giá từ khách hàng", "client testimonials"],

  ["“Website chạm đúng đến giá trị cốt lõi của thương hiệu từ màu sắc, bố cục đến nội dung. Team S.Sens rất hài lòng khi nhận được sản phẩm cũng như cách làm việc của studio”", "\"The website captures the core values of the brand - from colors and layout to content. The S.Sens team is very satisfied with both the product and the studio's working approach.\""],
  ["“Website chạm đúng đến giá trị cốt lõi của thương hiệu từ màu sắc, bố cục đến nội dung. Team S.Sens rất hài lòng khi nhận được sản phẩm cũng như cách làm việc của Dao.Design”", "\"The website captures the core values of the brand - from colors and layout to content. The S.Sens team is very satisfied with both the product and Dao.Design's working approach.\""],
  ["“Đã từng có cơ hội làm việc với Dao.Design và rất hài lòng về sự chỉn chu trong giao tiếp cũng như chuyên môn thiết kế của studio\"", "\"Having had the opportunity to work with Dao.Design, I am very pleased with the meticulous communication and design expertise of the studio.\""],
  ["“One of those guys i know off don't need the best equipment, a piece of paper can draw a landscape of awesomeness to impress the crowd.”", "\"One of those guys I know doesn't need the best equipment - a piece of paper can draw a landscape of awesomeness to impress the crowd.\""],

  // Contact
  ["Let's Talk", "Let's Talk"],
  ["Bạn đã có ý tưởng? Hãy để chúng tôi giúp bạn hiện thực hoá.", "Have an idea? Let us help you bring it to life."],
  ["Bạn đã có ý tưởng? Hãy để chúng tôi giúp bạn hiện thực hoá.", "Have an idea? Let us help you make it reality."],
  ["Hãy liên hệ trực tiếp hoặc gửi thông tin qua biểu mẫu, đội ngũ của chúng tôi sẽ kết nối với bạn trong thời gian sớm nhất.", "Contact us directly or send your information through the form, and our team will get back to you as soon as possible."],
  ["họ và tên", "full name"],
  ["Họ và Tên*", "Full Name*"],
  ["Email*", "Email*"],
  ["Lời nhắn", "Message"],
  ["LỜI NHẮN", "MESSAGE"],
  ["Liên Hệ Ngay", "Contact Now"],
  ["kết nối ngay", "connect now"],
  ["Số điện thoại", "Phone Number"],
  ["Cảm ơn bạn! Chúng tôi sẽ liên hệ trong thời gian sớm nhất.", "Thank you! We will contact you as soon as possible."],
  ["ý tưởng", "idea"],

  // Footer
  ["Bạn đã sẵn sàng chia sẻ?", "Ready to share?"],
  ["Bạn đã sẵn sàng chia sẻ?", "Ready to share?"],
  ["Kết nối với chúng tôi để cùng bắt đầu hành trình hiện thực hóa tầm nhìn của bạn.", "Connect with us to start the journey of realizing your vision."],
  ["Dao.Design", "Dao.Design"],
  ["working globally", "working globally"],
  ["based in Vietnam", "based in Vietnam"],

  // About page specific
  ["Trong gần một thập kỉ làm việc trong ngành thiết kế sáng tạo, chúng tôi chúng kiến một thị trường đang dần bão hòa bởi những cam kết thiếu chiều sâu và các giải pháp chưa tương xứng với kỳ vọng, chúng tôi thấu hiểu rằng khách hàng chính là đối tượng phải đối mặt với nhiều rủi ro nhất. Dao.design được ra đời với mong muốn phá bỏ rào cản đó.", "In nearly a decade working in the creative design industry, we witnessed a market becoming saturated with shallow promises and solutions that fell short of expectations. We understand that clients are the ones facing the most risk. Dao.Design was born with the desire to break down that barrier."],
  ["Lấy sự tử tế và uy tín làm tôn chỉ hoạt động, chúng tôi cam kết mang lại những giá trị thiết kế thực thụ. Bằng việc kết hợp chặt chẽ giữa quy trình minh bạch, tư duy thiết kế lấy người dùng làm trung tâm và sức mạnh công nghệ từ các giải pháp low-code hiện đại, chúng tôi khẳng định trách nhiệm trong việc bảo vệ tối đa lợi ích và ngân sách của khách hàng. Tại đây, niềm tin của bạn không chỉ là mục tiêu, mà là nền tảng cho mọi giải pháp mà chúng tôi kiến tạo.", "With kindness and reputation as our guiding principles, we are committed to delivering genuine design value. By tightly integrating transparent processes, user-centered design thinking, and the technological power of modern low-code solutions, we affirm our responsibility to protect our clients' interests and budgets. Here, your trust is not just a goal — it is the foundation for every solution we create."],
  ["Giữa một thị trường công nghệ chuyển động không ngừng, The Martec cần một 'gương mặt' trực tuyến hiện đại hơn để củng cố sự hiện diện của mình. Bài toán đặt ra là làm sao để vừa giữ được sự tin cậy của một công ty công nghệ, vừa thể hiện được cái chất sáng tạo của một nền tảng kết nối.", "In a rapidly moving technology market, The Martec needed a more modern online face to strengthen its presence. The challenge was how to maintain the credibility of a tech company while expressing the creative spirit of a connection platform."],
  ["Đối với dự án The Martec, chúng tôi tập trung vào việc biến những dữ liệu phức tạp của một nền tảng SaaS trở nên gần gũi và dễ cảm nhận. Giao diện không chỉ dừng lại ở những cú click, mà là một hành trình kể chuyện bằng hình ảnh (Visual Storytelling). Bằng cách kết hợp các chuyển động mượt mà và hệ thống tương tác có chiều sâu, chúng tôi giúp người dùng 'chạm' vào giá trị cốt lõi của sản phẩm một cách tự nhiên và trung thực nhất.", "For The Martec project, we focused on making the complex data of a SaaS platform feel approachable and tangible. The interface goes beyond clicks — it's a visual storytelling journey. By combining smooth animations and deep interaction systems, we help users 'touch' the core value of the product in the most natural and honest way."],
  ["Chúng tôi muốn thể hiện một doanh nghiệp Saas thân thiện và thú vị hơn bằng cách sử dụng hình ảnh icon linh hoạt và hình minh họa trừu tượng để chuyển hóa những khái niệm công nghệ phức tạp thành trải nghiệm thị giác dễ hiểu.", "We wanted to present a friendlier, more engaging SaaS business by using flexible icons and abstract illustrations to transform complex tech concepts into easy-to-understand visual experiences."],
  ["Định hướng thiết kế của The Martec tập trung vào việc đơn giản hóa sự phức tạp thông qua ngôn ngữ thị giác hiện đại và nhất quán. Bằng cách sử dụng hệ thống icon kết hợp cùng hình minh họa dễ hiểu, từ đó đơn giản hóa các thông tin khô khan thành một giao diện trực quan với người xem. Sự liên kết chặt chẽ giữa hình ảnh và nội dung tạo nên một hệ thống phân cấp thị giác thông minh, giúp tối ưu hóa trải nghiệm người dùng và thúc đẩy chuyển đổi hiệu quả.", "The Martec's design direction focuses on simplifying complexity through a modern, consistent visual language. By using icon systems combined with easy-to-understand illustrations, we transform dry information into an intuitive interface. The tight connection between visuals and content creates a smart visual hierarchy that optimizes user experience and drives effective conversion."],
  ["Tọa lạc tại vị trí đắc địa nơi trái tim phố cổ Hà Nội, Manevi Premier Boutique Hotel hiện diện như một biểu tượng của sự giao thoa tinh tế giữa nét quyến rũ cổ điển đặc trưng của di sản và hơi thở sang trọng, phóng khoáng của thời đại mới. Dự án thiết kế website của chúng tôi hướng tới việc số hóa trải nghiệm cao cấp này, mang đến trải nghiệm trực tuyến liền mạch và đẳng cấp cho tệp khách hàng tinh hoa của doanh nghiệp.", "Located in a prime position at the heart of Hanoi's Old Quarter, Manevi Premier Boutique Hotel stands as a symbol of the refined intersection between classic heritage charm and the luxurious, liberating spirit of the new era. Our website design project aims to digitalize this premium experience, delivering a seamless and sophisticated online experience for the business's discerning clientele."],
  ["Chúng tôi định hướng website sẽ không giống một trang web thương mại thông thường mà giống như một cuốn catalogue nghệ thuật. Mang hơi thở của Modern Minimalist kết hợp với hình ảnh khổ lớn cùng Layout khác biệt và Animation tinh tế nhằm mang lại trải nghiệm lướt web độc đáo - mô phỏng chính xác tính chất “Boutique” của khách sạn.", "We envisioned a website that is not like a typical commercial site but更像 an art catalogue. Bearing the spirit of Modern Minimalism combined with large-format images, distinctive layouts, and refined animations, it delivers a unique browsing experience — precisely mirroring the 'Boutique' nature of the hotel."],
  ["Mang hơi thở của Modern Minimalist kết hợp với hình ảnh khổ lớn cùng Layout khác biệt và Animation tinh tế nhằm mang lại trải nghiệm lướt web độc đáo - mô phỏng chính xác tính chất “Boutique” của khách sạn.", "Bearing the spirit of Modern Minimalism combined with large-format images, distinctive layouts, and refined animations, delivering a unique browsing experience — precisely mirroring the 'Boutique' nature of the hotel."],
  ["Sức sống của website nằm ở hệ thống Micro-interactions được tính toán cực kì kĩ lưỡng. Các hiệu ứng chuyển cảnh được thiết kế với tốc độ vừa phải, mượt mà như nhịp thở, tránh mọi sự đột ngột để duy trì cảm giác thư thái. Từ hiệu ứng Fade-in dịu nhẹ khi hình ảnh xuất hiện, đến chuyển động Parallax tạo chiều sâu không gian, hay những tương tác nhỏ nhất khi rê chuột (hover) đều được tinh chỉnh tỉ mỉ. Tất cả không chỉ nhằm mục đích trang trí mà còn để phản chiếu dịch vụ tận tâm, nhẹ nhàng và chuyên nghiệp mà Manevi Premier dành cho khách hàng trong đời thực.", "The vitality of the website lies in its meticulously crafted Micro-interactions. Transition effects are designed with moderate, smooth speed - like breathing - avoiding any abruptness to maintain a sense of calm. From the gentle Fade-in effects when images appear, to Parallax movements creating spatial depth, to the smallest hover interactions — all are finely tuned. These aren't just decorative; they reflect the dedicated, gentle, and professional service that Manevi Premier provides to its guests in real life."],
  ["Thay vì đi theo cấu trúc lưới (grid) cứng nhắc của các website khách sạn thông thường, website Manevi Premier sở hữu một Editorial Layout (Bố cục tạp chí) đầy cảm hứng. Các khối nội dung được sắp xếp bất đối xứng một cách có tính toán, tạo ra những 'khoảng thở' (white space) sang trọng, giúp hình ảnh kiến trúc của khách sạn trở thành nhân vật chính", "Instead of following the rigid grid structure of typical hotel websites, Manevi Premier's website features an inspiring Editorial Layout. Content blocks are asymmetrically arranged with intention, creating luxurious white spaces that let the hotel's architectural imagery take center stage."],
  ["layout khác biệt", "distinctive layouts"],
  ["animation tinh tế", "refined animations"],
  ["Ngôn ngữ thị giác", "Visual Language"],
  ["Giao diện tương tác", "Interactive Interface"],
  ["S.Sens Homes là một chuỗi căn hộ mô hình Short-term Rental (lưu trú ngắn hạn) bắt đầu với một cơ sở tại Hà Nội vào năm 2015. Đến nay hệ thống chuỗi căn hộ của S.Sens đã lên tới con số trên 40 căn hộ, trải rộng khắp 5 thành phố lớn tại Việt Nam.", "S.Sens Homes is a chain of Short-term Rental apartments that began with one location in Hanoi in 2015. Today, S.Sens has grown to over 40 apartments across 5 major cities in Vietnam."],
  ["Để S.Sens có thể truyền tải mục tiêu thương hiệu đó là “Thiết kế riêng biệt giúp bạn trải nghiệm nhịp sống thành phố một cách chân thực và thoải mái nhất, nơi lưu giữ những kỷ niệm đẹp trong suốt kỳ nghỉ của bạn” trên môi trường Digital tốt hơn, chúng tôi đã giúp S.Sens định hướng hình ảnh và xây dựng website của mình.", "To help S.Sens better communicate its brand mission — 'Distinctive design helping you experience city life in the most authentic and comfortable way, a place to keep beautiful memories throughout your stay' — in the digital environment, we helped S.Sens define its visual direction and build its website."],
  ["Chúng tôi xác định mục tiêu chung cho dự án đó là xây dựng thiết kế trải nghiệm digital truyền tải được các cảm nhận về không gian căn hộ của S.Sens và đồng thời tạo dựng sự chuyên nghiệp và tin cậy dành cho nhóm khách hàng là chủ đầu tư.", "We defined the project's overall goal as building a digital experience design that conveys the feel of S.Sens apartment spaces while establishing professionalism and trust for the investor client segment."],
  ["Dựa trên mục tiêu dự án, chúng tôi xác định phong cách thiết kế tối giản (Minimalist) là chủ đạo. Website sử dụng những nét mảnh kết hợp hình ảnh khổ lớn mô phỏng khung ảnh treo tường, từ đó gợi lên cảm giác về nơi lưu trữ kỉ niệm.", "Based on the project goals, we identified Minimalist design as the guiding style. The website uses thin lines combined with large-format images resembling framed wall art, evoking a sense of a place for storing memories."],
  ["Từ định hướng thiết kế, chúng tôi quyết định sử dụng tone màu nâu trầm cho toàn bộ website. Màu nâu cho cảm giác về sự ấm cúng và chân thành - điều mà khách hàng có khi trải nghiệm tại S.Sens. Đồng thời, mọi hình ảnh căn hộ đều được chọn lọc kĩ càng để đảm bảo tính nhất quán cho diện mạo website.", "Following the design direction, we decided to use a deep brown color tone throughout the website. Brown conveys warmth and sincerity — what customers feel when experiencing S.Sens. All apartment images are carefully curated to ensure visual consistency."],
  ["Ngoài việc xây dựng và cho thuê căn hộ riêng, S.Sens đã mở rộng mô hình kinh doanh thêm mảng dịch vụ tư vấn, set up và quản lý vận hành căn hộ. Đối tượng truy cập website của S.Sens không chỉ bao gồm nhóm khách du lịch có nhu cầu đặt căn hộ mà còn bao gồm cả những khách hàng là chủ đầu tư cần có cái nhìn tổng quát về doanh nghiệp.", "Beyond building and renting apartments, S.Sens has expanded its business model to include consulting, setup, and operational management services. S.Sens website visitors include not only travelers looking to book apartments but also investors seeking a comprehensive view of the business."],
  ["Chúng tôi đã xây dựng các bài blog với chủ đề chính là quy trình set up các căn hộ, với kinh nghiệm và hình ảnh thực tế từ các founder của S.Sens để giúp nhóm khách hàng là chủ đầu tư có cái nhìn khái quát về quy trình của S.Sens. Điều này cũng làm tăng giá trị sử dụng cho website, gia tăng tỉ lệ quay lại và hỗ trợ cho việc quảng bá sau này.", "We built blog articles centered on the apartment setup process, drawing from S.Sens founders' real experiences and imagery. This helps investor clients gain an overview of S.Sens's process. It also increases the website's utility value, boosts return visits, and supports future promotion."],
  ["Mặc dù website mới của S.Sens mới chỉ đi vào hoạt động trong vòng vài tháng ngắn ngủi, tuy nhiên chúng tôi và đội ngũ S.SSens đều đã sớm nhận thấy được hiệu quả bước đầu mà dự án xây dựng trải nghiệm digital mang lại. Thể hiện qua việc lượt booking từ website tăng, với tỉ lệ chốt đơn ~80% với KH từ website và mang về thêm 20% doanh thu OTA cho doanh nghiệp.", "Although S.Sens's new website has only been live for a few months, both we and the S.Sens team have already seen the initial effectiveness of the digital experience project. This is reflected in increased website bookings, with an ~80% conversion rate for website leads and an additional 20% OTA revenue for the business."],

  // Project specific
  ["The Martec là một nền tảng tiên phong trong việc chuyển hóa dữ liệu nhân sự thành sức mạnh truyền thông, từ đó giúp các thương hiệu lớn xây dựng uy tín và thu hút nhân tài bằng những nội dung chân thực, được cá nhân hóa một cách thông minh.", "The Martec is a pioneering platform that transforms HR data into communication power, helping major brands build reputation and attract talent through authentic, intelligently personalized content."],

  // Contact page
  ["Liên hệ với chúng tôi", "Contact Us"],

  // General
  ["- Tâm huyết", "- Our Passion"],
  ["Giới thiệu", "About"],
  ["kết nối", "connect"],
  ["Let\u2019s Talk", "Let's Talk"],

  // Special characters / leftovers
  ["‍", ""],
];

// Sort by length (longest first) for proper matching
translationMap.sort((a, b) => b[0].length - a[0].length);

function translateText(text) {
  let result = text;
  for (const [vi, en] of translationMap) {
    // Use exact/regex matching to avoid partial replacements
    const escaped = vi.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped, 'g');
    result = result.replace(re, en);
  }
  return result;
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name.endsWith('.html') && !entry.name.endsWith('.original.html')) {
      console.log('Translating:', fullPath);
      const html = fs.readFileSync(fullPath, 'utf-8');

      // Create backup if not exists
      const backupPath = fullPath + '.original';
      if (!fs.existsSync(backupPath)) {
        fs.writeFileSync(backupPath, html);
        console.log('  Backup created:', backupPath);
      }

      const $ = cheerio.load(html);

      // Translate <title>
      $('title').each((i, el) => {
        const text = $(el).text();
        if (text) {
          const translated = translateText(text);
          if (translated !== text) {
            $(el).text(translated);
          }
        }
      });

      // Translate meta description
      $('meta[name="description"]').each((i, el) => {
        const content = $(el).attr('content');
        if (content) {
          const translated = translateText(content);
          if (translated !== content) {
            $(el).attr('content', translated);
          }
        }
      });

      // Translate visible text in body
      // We target text nodes, not code/attributes
      $('body *').contents().each(function() {
        if (this.type === 'text') {
          const text = $(this).text();
          if (text && text.trim()) {
            const translated = translateText(text);
            if (translated !== text) {
              $(this).replaceWith(translated);
            }
          }
        }
      });

      // Also handle placeholder attributes
      $('[placeholder]').each((i, el) => {
        const val = $(el).attr('placeholder');
        if (val) {
          const translated = translateText(val);
          if (translated !== val) {
            $(el).attr('placeholder', translated);
          }
        }
      });

      // Handle aria-label
      $('[aria-label]').each((i, el) => {
        const val = $(el).attr('aria-label');
        if (val) {
          const translated = translateText(val);
          if (translated !== val) {
            $(el).attr('aria-label', translated);
          }
        }
      });

      // Handle alt text
      $('[alt]').each((i, el) => {
        const val = $(el).attr('alt');
        if (val && val !== '') {
          const translated = translateText(val);
          if (translated !== val) {
            $(el).attr('alt', translated);
          }
        }
      });

      const result = $.html();
      fs.writeFileSync(fullPath, result);
      console.log('  Translated successfully');
    }
  }
}

console.log('=== Starting Translation ===');
walkDir(siteDir);
console.log('=== Translation Complete ===');
