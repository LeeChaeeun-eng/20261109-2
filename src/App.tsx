import { FormEvent, useEffect, useState } from "react"

// 반복되는 진료 카드의 내용을 데이터로 분리하면 카드 추가와 수정이 쉬워집니다.
const programs = [
  {
    number: "01",
    title: "통증 클리닉",
    description: ["목·어깨·허리 통증과", "일상 속 불편함을 세심하게"],
    detail:
      "침, 약침, 부항과 추나 치료를 환자의 상태에 맞게 구성하여 통증의 원인과 일상의 불편함을 함께 살핍니다.",
    icon: "needle",
  },
  {
    number: "02",
    title: "여성 건강 클리닉",
    description: ["생애 주기와 컨디션에 맞춘", "섬세한 건강 관리"],
    detail:
      "생리통, 산후 회복, 갱년기 등 생애 주기에 따른 변화를 충분히 상담하고 몸의 균형을 고려해 진료합니다.",
    icon: "needle",
  },
  {
    number: "03",
    title: "소화·면역 클리닉",
    description: ["몸의 균형과 회복을 돕는", "개인별 맞춤 진료"],
    detail:
      "소화 상태와 수면, 식습관을 함께 확인해 몸이 스스로 회복할 수 있도록 개인별 치료 계획을 세웁니다.",
    icon: "balance",
  },
]

// 히어로 슬라이드는 한 곳에서 관리하며 텍스트와 그림 색상을 함께 바꿉니다.
const heroSlides = [
  {
    eyebrow: "ON GYEOL KOREAN MEDICINE CLINIC",
    title: ["몸의 균형을 살피고,", "일상의 건강을 잇습니다."],
    description: [
      "한 사람의 생활과 체질을 세심하게 살피는",
      "온결한의원의 맞춤 진료를 경험해 보세요.",
    ],
    variant: 0,
  },
  {
    eyebrow: "A THOUGHTFUL WAY TO RECOVER",
    title: ["증상 너머의 원인을,", "차분히 들여다봅니다."],
    description: [
      "충분한 대화와 꼼꼼한 진단을 바탕으로",
      "지금 내 몸에 필요한 치료를 제안합니다.",
    ],
    variant: 1,
  },
  {
    eyebrow: "CARE FOR YOUR EVERYDAY LIFE",
    title: ["건강한 회복이", "일상으로 이어지도록."],
    description: [
      "치료 후의 생활 습관과 회복 과정까지",
      "온결한의원이 곁에서 함께하겠습니다.",
    ],
    variant: 2,
  },
]

const healthArticles = [
  {
    category: "생활 건강",
    title: "아침마다 목이 뻐근한 이유와 편안한 수면 자세",
    date: "2025. 02. 14",
  },
  {
    category: "온결 이야기",
    title: "좋은 진료는 충분히 듣는 것에서 시작합니다",
    date: "2025. 02. 07",
  },
  {
    category: "한방 상식",
    title: "환절기 면역 관리를 위한 세 가지 생활 습관",
    date: "2025. 01. 24",
  },
]

// 시안의 원형과 침 이미지를 CSS 도형으로 재현한 재사용 컴포넌트입니다.
function ClinicArtwork({ variant }: { variant: number }) {
  return (
    <div className={`clinic-art clinic-art--${variant}`} aria-hidden="true">
      <div className="clinic-art__outer" />
      <div className="clinic-art__inner" />
      <div className="clinic-art__sun" />
      <div className="clinic-art__stem">
        {Array.from({ length: 9 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="clinic-art__needles">
        {Array.from({ length: 9 }).map((_, index) => (
          <i key={index} style={{ "--i": index } as React.CSSProperties} />
        ))}
      </div>
    </div>
  )
}

function Header({ onConsult }: { onConsult: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [
    ["한의원 소개", "#about"],
    ["진료 안내", "#program"],
    ["특화 클리닉", "#clinics"],
    ["건강정보", "#information"],
    ["오시는 길", "#location"],
  ]

  return (
    <>
      <div className="hours-bar">
        <div>
          <span>평일 09:30 - 20:00</span>
          <b>·</b>
          <span>토요일 09:30 - 14:00</span>
          <b>·</b>
          <span>일요일/공휴일 휴진</span>
          <a href="tel:025550825">진료문의 02-555-0825</a>
        </div>
      </div>
      <header className="site-header">
        <div className="site-header__inner">
          <a className="logo" href="#top" onClick={() => setMenuOpen(false)}>
            <strong>온결</strong>
            <span>한의원</span>
          </a>
          <nav
            className={menuOpen ? "nav nav--open" : "nav"}
            aria-label="주요 메뉴"
          >
            {links.map(([label, href]) => (
              <a href={href} key={label} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            <button className="nav__mobile-cta" onClick={onConsult}>
              예약 · 상담
            </button>
          </nav>
          <button className="consult-button" onClick={onConsult}>
            예약 · 상담
          </button>
          <button
            className={
              menuOpen ? "menu-button menu-button--open" : "menu-button"
            }
            aria-label="메뉴 열기"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
    </>
  )
}

// 상담 팝업은 ESC 키, 바깥 영역, 닫기 버튼의 세 가지 방법으로 닫을 수 있습니다.
function ConsultationModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal__close" onClick={onClose} aria-label="닫기">
          ×
        </button>
        {submitted ? (
          <div className="modal__complete">
            <span>온결</span>
            <h2 id="modal-title">상담 신청이 접수되었습니다.</h2>
            <p>확인 후 남겨주신 연락처로 안내드리겠습니다.</p>
            <button onClick={onClose}>확인</button>
          </div>
        ) : (
          <>
            <p className="modal__eyebrow">RESERVATION</p>
            <h2 id="modal-title">진료 상담 신청</h2>
            <p className="modal__intro">
              간단한 정보를 남겨주시면 친절하게 안내해 드립니다.
            </p>
            <form onSubmit={submit}>
              <label>
                성함
                <input required placeholder="성함을 입력해 주세요" />
              </label>
              <label>
                연락처
                <input required type="tel" placeholder="010-0000-0000" />
              </label>
              <label>
                상담 내용
                <textarea placeholder="불편한 증상이나 문의 내용을 적어 주세요" />
              </label>
              <button type="submit">상담 신청하기</button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// 진료 카드에서 선택한 프로그램의 설명을 보여 주는 공용 상세 팝업입니다.
function ProgramModal({
  program,
  onClose,
  onConsult,
}: {
  program: typeof programs[number]
  onClose: () => void
  onConsult: () => void
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <article
        className="modal program-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="program-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal__close" onClick={onClose} aria-label="닫기">
          ×
        </button>
        <p className="modal__eyebrow">CARE PROGRAM · {program.number}</p>
        <span className={`program-modal__icon ${program.icon}`}>
          <i />
        </span>
        <h2 id="program-modal-title">{program.title}</h2>
        <p className="program-modal__detail">{program.detail}</p>
        <div className="program-modal__actions">
          <button
            onClick={() => {
              onClose()
              onConsult()
            }}
          >
            이 진료 상담하기
          </button>
          <button onClick={onClose}>계속 둘러보기</button>
        </div>
      </article>
    </div>
  )
}

export default function App() {
  const [consultOpen, setConsultOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedProgram, setSelectedProgram] =
    useState<typeof programs[number] | null>(null)

  // 6초마다 다음 슬라이드로 이동하며 마지막 다음에는 첫 슬라이드로 돌아갑니다.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % heroSlides.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [])

  const slide = heroSlides[currentSlide]

  return (
    <main>
      <Header onConsult={() => setConsultOpen(true)} />

      <section className="hero" id="top">
        <div className="hero__inner">
          <div className="hero__content" key={currentSlide}>
            <p className="eyebrow">{slide.eyebrow}</p>
            <h1>
              {slide.title[0]}
              <br />
              {slide.title[1]}
            </h1>
            <p className="hero__description">
              {slide.description[0]}
              <br />
              {slide.description[1]}
            </p>
            <div className="hero__actions">
              <button onClick={() => setConsultOpen(true)}>
                진료 상담하기 <span>→</span>
              </button>
              <a href="#about">
                진료 철학 알아보기 <span>→</span>
              </a>
            </div>
            <div
              className="pagination"
              aria-label={`슬라이드 ${currentSlide + 1} / ${heroSlides.length}`}
            >
              <button
                onClick={() =>
                  setCurrentSlide(
                    (currentSlide - 1 + heroSlides.length) % heroSlides.length,
                  )
                }
                aria-label="이전 슬라이드"
              >
                {String(currentSlide + 1).padStart(2, "0")}
              </button>
              <div className="pagination__track">
                {heroSlides.map((item, index) => (
                  <button
                    className={index === currentSlide ? "is-active" : ""}
                    key={item.eyebrow}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`${index + 1}번 슬라이드 보기`}
                  />
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentSlide((currentSlide + 1) % heroSlides.length)
                }
                aria-label="다음 슬라이드"
              >
                03
              </button>
            </div>
          </div>
          <ClinicArtwork variant={slide.variant} />
        </div>
      </section>

      <section className="program-section" id="program">
        <div className="program-section__inner">
          <p className="eyebrow">CARE PROGRAM</p>
          <h2>온결의 진료 프로그램</h2>
          <p className="program-section__lead">
            증상만이 아닌 생활의 흐름까지 함께 살핍니다.
          </p>
          <div className="program-grid">
            {programs.map((program) => (
              <button
                className="program-card"
                key={program.number}
                onClick={() => setSelectedProgram(program)}
              >
                <span className="program-card__number">{program.number}</span>
                <span className={`program-card__icon ${program.icon}`}>
                  <i />
                </span>
                <h3>{program.title}</h3>
                <p>
                  {program.description.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
                <span className="program-card__more">자세히 보기 →</span>
              </button>
            ))}
          </div>
        </div>
        <a className="scroll-note" href="#program">
          SCROLL <span>↓</span>
        </a>
      </section>

      <section className="philosophy" id="about">
        <div className="section-inner philosophy__inner">
          <div className="philosophy__heading">
            <p className="eyebrow">OUR PHILOSOPHY</p>
            <h2>
              몸과 마음이
              <br />
              편안해지는 진료
            </h2>
          </div>
          <div className="philosophy__copy">
            <strong>온전히 듣고, 바르게 살핍니다.</strong>
            <p>
              온결은 눈앞의 증상만 빠르게 다루기보다 몸이 보내는 신호와 생활의
              흐름을 함께 살핍니다. 충분한 대화로 시작해 꼭 필요한 치료만
              정직하게 제안합니다.
            </p>
            <dl>
              <div>
                <dt>01</dt>
                <dd>충분한 상담</dd>
              </div>
              <div>
                <dt>02</dt>
                <dd>개인별 맞춤 진료</dd>
              </div>
              <div>
                <dt>03</dt>
                <dd>일상까지 잇는 관리</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="clinic-section" id="clinics">
        <div className="section-inner">
          <div className="section-heading">
            <p className="eyebrow">SPECIAL CLINIC</p>
            <h2>더 세심하게 살피는 특화 진료</h2>
            <p>몸의 변화와 생활의 리듬을 고려한 온결의 진료입니다.</p>
          </div>
          <div className="clinic-list">
            {programs.map((program, index) => (
              <button
                key={program.number}
                onClick={() => setSelectedProgram(program)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{program.title}</strong>
                <i>→</i>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="information-section" id="information">
        <div className="section-inner">
          <div className="section-heading section-heading--row">
            <div>
              <p className="eyebrow">HEALTH INFORMATION</p>
              <h2>건강한 일상을 위한 이야기</h2>
            </div>
            <a href="#information-list">전체 글 보기 →</a>
          </div>
          <div className="article-grid" id="information-list">
            {healthArticles.map((article, index) => (
              <article key={article.title}>
                <div className={`article-art article-art--${index}`}>
                  <span />
                </div>
                <p>{article.category}</p>
                <h3>{article.title}</h3>
                <time>{article.date}</time>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="location-section" id="location">
        <div className="section-inner location-grid">
          <div className="location-copy">
            <p className="eyebrow">LOCATION</p>
            <h2>온결한의원 오시는 길</h2>
            <p className="location-copy__address">
              서울특별시 강남구 테헤란로 120, 온결빌딩 3층
            </p>
            <dl>
              <div>
                <dt>진료 문의</dt>
                <dd>
                  <a href="tel:025550825">02-555-0825</a>
                </dd>
              </div>
              <div>
                <dt>평일</dt>
                <dd>09:30 - 20:00</dd>
              </div>
              <div>
                <dt>토요일</dt>
                <dd>09:30 - 14:00</dd>
              </div>
            </dl>
            <a
              className="location-button"
              href="https://maps.google.com/?q=서울특별시+강남구+테헤란로+120"
              target="_blank"
              rel="noreferrer"
            >
              지도에서 길 찾기 <span>→</span>
            </a>
          </div>
          <div className="map-art" aria-label="온결한의원 약도">
            <span className="map-art__road map-art__road--one" />
            <span className="map-art__road map-art__road--two" />
            <span className="map-art__road map-art__road--three" />
            <span className="map-art__marker">온결</span>
            <small>테헤란로</small>
          </div>
        </div>
      </section>

      <footer>
        <div className="section-inner footer-inner">
          <a className="logo logo--footer" href="#top">
            <strong>온결</strong>
            <span>한의원</span>
          </a>
          <p>
            서울특별시 강남구 테헤란로 120 · 대표원장 온결 · 사업자등록번호
            120-00-00000
          </p>
          <small>© ON GYEOL KOREAN MEDICINE CLINIC.</small>
        </div>
      </footer>

      {consultOpen && (
        <ConsultationModal onClose={() => setConsultOpen(false)} />
      )}
      {selectedProgram && (
        <ProgramModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
          onConsult={() => setConsultOpen(true)}
        />
      )}
    </main>
  )
}
