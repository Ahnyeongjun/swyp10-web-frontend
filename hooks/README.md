# 🎯 React 커스텀 훅 컬렉션

프론트엔드 프로젝트에서 재사용 가능한 로직을 추상화한 커스텀 훅들의 모음입니다. 각 훅은 특정 기능에 특화되어 있으며, React의 기본 훅들을 조합하여 더 강력하고 유연한 기능을 제공합니다.

## 📚 목차

- [useAuth](#useauth) - 사용자 인증 상태 관리
- [useBookmark](#usebookmark) - 북마크 기능 관리
- [useFestivalData](#usefestivaldata) - 축제 데이터 관리
- [useInView](#useinview) - 요소 가시성 추적
- [useMapEvents](#usemapevents) - 지도 이벤트 처리
- [useMapMarkers](#usemapmarkers) - 지도 마커 관리
- [useNaverMapScript](#usenavermapscript) - 네이버 지도 스크립트 로드
- [useShareThisPage](#usesharethispage) - 페이지 공유 기능

---

## 🔐 useAuth

### 📖 개요

사용자의 로그인 상태를 관리하고 현재 사용자 정보를 가져오는 훅입니다.

### 🎯 주요 기능

- **자동 인증 상태 확인**: 컴포넌트 마운트 시 자동으로 사용자 정보 조회
- **캐싱 최적화**: 5분간 데이터를 신선하게 유지하여 불필요한 API 호출 방지
- **에러 처리**: 인증 실패 시 적절한 상태 반환
- **수동 새로고침**: `refetch` 함수로 필요시 데이터 재조회

### 💡 사용 예시

```tsx
function Header() {
  const { isLoggedIn, user, isLoading } = useAuth();

  if (isLoading) return <Spinner />;

  return (
    <header>
      {isLoggedIn ? <UserProfile user={user} /> : <LoginButton />}
    </header>
  );
}
```

### 🔧 기술적 특징

- **React Query 활용**: `useQuery`를 사용한 서버 상태 관리
- **타입 안전성**: TypeScript로 반환값 타입 정의
- **재시도 방지**: `retry: false`로 인증 실패 시 불필요한 재시도 방지

---

## 🔖 useBookmark

### 📖 개요

축제 북마크 추가/제거 기능을 관리하는 훅입니다.

### 🎯 주요 기능

- **북마크 토글**: 현재 상태에 따라 추가/제거 자동 처리
- **실시간 UI 업데이트**: React Query 캐시 무효화로 즉시 반영
- **사용자 피드백**: 성공/실패 시 토스트 메시지 표시
- **에러 처리**: 로그인 필요, 권한 부족 등 다양한 에러 상황 대응

### 💡 사용 예시

```tsx
function FestivalCard({ festival }) {
  const { toggleBookmark, isBookmarkLoading } = useBookmark({
    onSuccess: (festivalId, isBookmarked) => {
      console.log(
        `축제 ${festivalId} 북마크 ${isBookmarked ? '추가' : '제거'}`,
      );
    },
  });

  return (
    <button
      onClick={() => toggleBookmark(festival.id, festival.is_marked)}
      disabled={isBookmarkLoading}
    >
      {festival.is_marked ? '❤️' : '🤍'}
    </button>
  );
}
```

### 🔧 기술적 특징

- **Mutation 관리**: `useMutation`으로 서버 상태 변경 처리
- **캐시 무효화**: 관련된 모든 쿼리를 동시에 무효화하여 일관성 보장
- **옵션 패턴**: `onSuccess`, `onError` 콜백으로 확장성 제공

---

## 🎪 useFestivalData

### 📖 개요

지도 기반 축제 데이터를 효율적으로 관리하는 훅입니다.

### 🎯 주요 기능

- **지도 경계 기반 데이터 로딩**: 현재 보이는 영역의 축제만 조회
- **중복 요청 방지**: 이미 로딩 중일 때 추가 요청 차단
- **메모이제이션**: 불필요한 리렌더링 방지
- **쿼리 파라미터 관리**: 필터링 조건 변경 시 데이터 재조회

### 💡 사용 예시

```tsx
function MapComponent() {
  const { festivals, loadFestivalsInBounds, isLoadingFestivals } =
    useFestivalData(focusFestivalId);

  const handleMapBoundsChange = bounds => {
    loadFestivalsInBounds(bounds, currentFilters);
  };

  return (
    <div>
      {isLoadingFestivals && <LoadingSpinner />}
      {festivals.map(festival => (
        <FestivalMarker key={festival.id} festival={festival} />
      ))}
    </div>
  );
}
```

### 🔧 기술적 특징

- **상태 관리**: `useState`와 `useRef`를 조합한 복잡한 상태 처리
- **성능 최적화**: `useMemo`와 `useCallback`으로 불필요한 연산 방지
- **에러 바운더리**: API 호출 실패 시 안전한 폴백 처리

---

## 👁️ useInView

### 📖 개요

DOM 요소가 뷰포트에 보이는지 추적하는 Intersection Observer 기반 훅입니다.

### 🎯 주요 기능

- **가시성 감지**: 요소가 화면에 나타나거나 사라질 때 콜백 실행
- **임계값 설정**: 요소가 얼마나 보여야 감지할지 설정 가능
- **SSR 안전**: 서버 사이드에서 안전하게 동작

### 💡 사용 예시

```tsx
function InfiniteScroll() {
  const [observe, unobserve] = useInView(isVisible => {
    if (isVisible) {
      loadMoreData();
    }
  }, 0.5); // 50% 보일 때 감지

  return (
    <div>
      {items.map(item => (
        <Item key={item.id} item={item} />
      ))}
      <div ref={el => el && observe(el)}>{isLoading && <Spinner />}</div>
    </div>
  );
}
```

### 🔧 기술적 특징

- **Intersection Observer API**: 모던 브라우저의 효율적인 가시성 감지
- **메모리 관리**: `useRef`로 observer 인스턴스 관리
- **타입 안전성**: TypeScript로 DOM 요소 타입 보장

---

## 🗺️ useMapEvents

### 📖 개요

네이버 지도의 다양한 이벤트를 처리하고 URL 상태와 동기화하는 훅입니다.

### 🎯 주요 기능

- **지도 이벤트 통합**: 줌, 이동, 크기 변화 등 모든 지도 이벤트 처리
- **URL 동기화**: 지도 상태를 URL 파라미터로 저장하여 공유 가능
- **디바운싱**: 연속된 이벤트를 적절한 지연 후 처리
- **메모리 누수 방지**: 컴포넌트 언마운트 시 타이머 정리

### 💡 사용 예시

```tsx
function MapContainer() {
  const mapEvents = useMapEvents();

  useEffect(() => {
    const map = naverMapInstance;

    // 지도 이벤트 바인딩
    naver.maps.Event.addListener(map, 'bounds_changed', () => {
      mapEvents.handleBoundsChange(map, filters, loadFestivals);
    });

    naver.maps.Event.addListener(map, 'center_changed', () => {
      mapEvents.handleCenterChange(map, filters);
    });

    return () => mapEvents.cleanup();
  }, []);
}
```

### 🔧 기술적 특징

- **이벤트 디바운싱**: `setTimeout`을 활용한 성능 최적화
- **URL 상태 관리**: Next.js의 `useRouter`와 `useSearchParams` 활용
- **타입 안전성**: 네이버 지도 API 타입 정의

---

## 📍 useMapMarkers

### 📖 개요

지도에 축제 마커를 효율적으로 생성하고 관리하는 훅입니다.

### 🎯 주요 기능

- **마커 생명주기 관리**: 생성, 제거, 업데이트 처리
- **메모리 누수 방지**: 기존 마커를 적절히 제거 후 새 마커 생성
- **줌 레벨 반응**: 지도 줌에 따른 마커 표시/숨김 처리

### 💡 사용 예시

```tsx
function MapWithMarkers({ festivals, mapInstance, currentZoom }) {
  const { createMarkers, clearMarkers } = useMapMarkers();

  useEffect(() => {
    if (mapInstance && festivals.length > 0) {
      createMarkers(festivals, currentZoom, mapInstance, handleMarkerClick);
    }

    return clearMarkers;
  }, [festivals, currentZoom, mapInstance]);
}
```

### 🔧 기술적 특징

- **Ref 기반 관리**: `useRef`로 마커 배열 참조 관리
- **콜백 최적화**: `useCallback`으로 함수 재생성 방지
- **지도 API 통합**: 네이버 지도 Marker API와의 효율적인 연동

---

## 🌐 useNaverMapScript

### 📖 개요

네이버 지도 JavaScript API를 동적으로 로드하고 관리하는 훅입니다.

### 🎯 주요 기능

- **동적 스크립트 로딩**: 필요할 때만 지도 API 로드
- **중복 로드 방지**: 이미 로드된 스크립트 재사용
- **에러 처리**: 스크립트 로드 실패 시 적절한 처리

### 💡 사용 예시

```tsx
function MapComponent() {
  const { loadScript, isScriptLoaded } = useNaverMapScript();

  useEffect(() => {
    if (!isScriptLoaded()) {
      loadScript(() => {
        initializeMap();
      });
    } else {
      initializeMap();
    }
  }, []);
}
```

### 🔧 기술적 특징

- **스크립트 관리**: DOM에 동적으로 script 태그 추가/제거
- **상태 추적**: `useRef`로 로드 상태 관리
- **환경 설정**: 설정 파일에서 API 키 관리

---

## 📤 useShareThisPage

### 📖 개요

현재 페이지 URL을 클립보드에 복사하는 간단한 공유 기능 훅입니다.

### 🎯 주요 기능

- **URL 복사**: 현재 페이지 링크를 클립보드에 복사
- **사용자 피드백**: 성공/실패 시 토스트 메시지 표시
- **에러 처리**: 복사 실패 시 적절한 에러 메시지

### 💡 사용 예시

```tsx
function ShareButton() {
  const { share } = useShareThisPage();

  return <button onClick={share}>📤 페이지 공유하기</button>;
}
```

### 🔧 기술적 특징

- **Clipboard API**: 모던 브라우저의 네이티브 복사 기능 활용
- **에러 바운더리**: try-catch로 안전한 에러 처리
- **토스트 통합**: 커스텀 토스트 시스템과 연동

---

## 🚀 사용 팁

### 1. **성능 최적화**

- `useCallback`과 `useMemo`를 적절히 활용하여 불필요한 리렌더링 방지
- API 호출 결과를 캐싱하여 중복 요청 최소화

### 2. **에러 처리**

- 각 훅에서 발생할 수 있는 에러 상황을 고려한 적절한 폴백 처리
- 사용자에게 명확한 피드백 제공

### 3. **타입 안전성**

- TypeScript를 활용한 인터페이스 정의로 런타임 에러 방지
- 제네릭을 활용한 유연한 타입 시스템 구축

### 4. **테스트 가능성**

- 각 훅의 로직을 독립적으로 테스트할 수 있도록 설계
- 의존성 주입을 통한 테스트 용이성 확보

---

## 📝 결론

이러한 커스텀 훅들은 React 애플리케이션의 복잡한 로직을 재사용 가능한 형태로 추상화하여, 개발 생산성과 코드 품질을 크게 향상시킵니다. 각 훅은 특정 도메인에 특화되어 있으면서도, 필요에 따라 조합하여 사용할 수 있도록 설계되었습니다.

프론트엔드 개발에서 자주 사용되는 패턴들을 커스텀 훅으로 만들어두면, 새로운 프로젝트에서도 빠르게 적용할 수 있고, 팀 전체의 개발 효율성을 높일 수 있습니다.
