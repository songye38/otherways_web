import React from 'react';
import styles from './Footer.module.css';

export default function Footer({
  brandName = 'OTHER WAYS',
  description = 'OTHERWAYS는 정해진 답을 거부하고, 자기만의 질문과 실행으로 새로운 길을 만드는 주도적 창작자들을 위한 미래 연구·실행 스튜디오입니다.',
  email = 'otherways.kr@gmail.com',
  instagramUrl = 'https://www.instagram.com/otherways.futures/',
  logoSrc = '/logo.png',
  businessInfo = {
    companyName: 'OTHERWAYS',
    representative: '박송이',
    registrationNumber: '211-87-00000',
    mailOrderNumber: '2023-서울 마포-0000',
    address: '서울특별시 마포구 월드컵로 14길 15, 3층'
  },
}) {
  const details = [
    ['상호', businessInfo.companyName],
    ['대표', businessInfo.representative],
    ['사업자등록번호', businessInfo.registrationNumber],
    ['통신판매업 신고번호', businessInfo.mailOrderNumber],
    ['주소', businessInfo.address],
  ].filter(([, value]) => value);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.main}>
          <div className={styles.brand}>
            {logoSrc
              ? <img className={styles.logo} src={logoSrc} alt={brandName} />
              : <p className={styles.brandName}>{brandName}</p>}
            <p className={styles.description}>{description}</p>
          </div>

          {(email || instagramUrl) && (
            <nav className={styles.contact} aria-label="문의 및 소셜 채널">
              <p className={styles.contactLabel}>CONTACT</p>
              {email && <a href={`mailto:${email}`}>{email}</a>}
              {instagramUrl && <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                Instagram<span className={styles.srOnly}> (새 탭에서 열기)</span>
              </a>}
            </nav>
          )}
        </div>

        {details.length > 0 && (
          <dl className={styles.business}>
            {details.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        )}

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <a href="#top">맨 위로</a>
        </div>
      </div>
    </footer>
  );
}
