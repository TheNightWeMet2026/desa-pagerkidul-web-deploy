/* =====================================================
   Desa Pagerkidul - Admin Dashboard (UI Only)
===================================================== */

(function () {
    const sidebar = document.querySelector('.admin-sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Mobile: show/hide sidebar
    const mobileOpen = document.getElementById('mobileSidebarOpen');
    const mobileClose = document.getElementById('mobileSidebarClose');
    if (mobileOpen && sidebar) {
        mobileOpen.addEventListener('click', () => sidebar.classList.add('show'));
    }
    if (mobileClose && sidebar) {
        mobileClose.addEventListener('click', () => sidebar.classList.remove('show'));
    }

    // Current date
    const dateEl = document.getElementById('currentDate');
    if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        });
    }

    // Table quick filters (client-side dummy)
    document.querySelectorAll('[data-table-filter]').forEach((input) => {
        input.addEventListener('input', () => {
            const targetId = input.getAttribute('data-table-filter');
            const table = document.getElementById(targetId);
            if (!table) return;
            const q = input.value.trim().toLowerCase();
            table.querySelectorAll('tbody tr').forEach((row) => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(q) ? '' : 'none';
            });
        });
    });

    // Modal helpers
    const previewModal = document.getElementById('previewModal');
    const previewBody = document.getElementById('previewBody');

  // Use preview button attributes from admin.html (no data-preview attribute exists)
  document.querySelectorAll('[data-bs-target="#previewModal"], [data-bs-target="#previewModal"], [data-bs-target="#previewModal"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title') || 'Preview';
      const body = btn.getAttribute('data-body') || '-';
      const media = btn.getAttribute('data-media') || '';

      if (previewBody) {
        previewBody.innerHTML = `
          <div class="row g-3 align-items-start">
            ${media ? `
              <div class="col-md-5">
                <div class="rounded-4 overflow-hidden border" style="background:#F8FAFC;">
                  <img src="${media}" alt="Preview" class="w-100" style="height:200px;object-fit:cover;">
                </div>
              </div>
            ` : ''}
            <div class="col-md-${media ? 7 : 12}">
              <div class="mb-2">
                <span class="badge rounded-pill text-bg-success" style="background:rgba(22,101,52,.12);border:1px solid rgba(22,101,52,.18);color:#166534;font-weight:900;">
                  ${title}
                </span>
              </div>
              <div class="text-muted fw-semibold">${body}</div>
            </div>
          </div>
        `;
      }

      const modalTitle = previewModal?.querySelector('.modal-title');
      if (modalTitle) modalTitle.textContent = title;
    });
  });

  // Edit modal pre-fill (frontend-only)
  const editModal = document.getElementById('editModal');

  // Backdrop (optional mobile UX)
  const backdrop = document.getElementById('sidebarBackdrop');
  if (mobileOpen && sidebar && backdrop) {
    mobileOpen.addEventListener('click', () => backdrop.classList.add('show'));
  }
  if (mobileClose && sidebar && backdrop) {
    mobileClose.addEventListener('click', () => backdrop.classList.remove('show'));
  }
  if (backdrop && sidebar) {
    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('show');
      backdrop.classList.remove('show');
    });
  }
  const editTitleEl = document.getElementById('editModalTitle');
  const editFieldA = document.getElementById('editFieldA');
  const editFieldB = document.getElementById('editFieldB');
  const editDescription = document.getElementById('editDescription');
  const editMediaPreview = document.getElementById('editMediaPreview');

  function setEditModalPayload(btn) {
    const title = btn.getAttribute('data-edit-title') || btn.getAttribute('data-title') || 'Edit Data';
    const fieldA = btn.getAttribute('data-edit-fielda') || btn.getAttribute('data-fielda') || '';
    const fieldB = btn.getAttribute('data-edit-fieldb') || btn.getAttribute('data-fieldb') || '';
    const desc = btn.getAttribute('data-edit-description') || btn.getAttribute('data-body') || '';
    const media = btn.getAttribute('data-edit-media') || btn.getAttribute('data-media') || '';

    if (editTitleEl) editTitleEl.textContent = title;
    if (editFieldA) editFieldA.value = fieldA;
    if (editFieldB) editFieldB.value = fieldB;
    if (editDescription) editDescription.value = desc;
    if (editMediaPreview && media) editMediaPreview.src = media;
  }

  document.querySelectorAll('[data-bs-target="#editModal"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!editModal) return;
      setEditModalPayload(btn);
    });
  });

})();



