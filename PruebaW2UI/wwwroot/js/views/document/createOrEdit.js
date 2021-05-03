function openPopup(id = 0, editMode = false) {
    if (!w2ui.foo) {
        $().w2form({
            name: 'foo',
            url: {
                save: '/Document/CreateOrEdit'
            },
            style: 'border: 0px; background-color: transparent;',
            fields: [
                { field: 'description', type: 'text', required: true, html: { label: 'Descripción' } },
                {
                    field: 'personId',
                    type: 'list',
                    html: { label: 'Persona' }
                },
                {
                    field: 'documentTypeId',
                    type: 'list',
                    html: { label: 'Tipo de Documento' }
                }
            ],
            actions: {
                "Limpiar": function () { this.clear(); },
                "Guardar": function () { this.save(); w2popup.close(); w2ui['grid'].reload(); }
            },
            onSubmit: function (formName, formObj) {
                var record;

                if (editMode) {
                    record = { id: formObj.postData.record.id, description: formObj.postData.record.description, personId: formObj.postData.record.personId, documentTypeId: formObj.postData.record.documentTypeId };
                }

                else {
                    record = { description: formObj.postData.record.description, personId: parseInt(formObj.postData.record.personId.id), documentTypeId: parseInt(formObj.postData.record.documentTypeId.id) }
                }

                $.extend(formObj.postData, record);
            },
            onRender: function (event) {
                var grid = w2ui.grid;
                var form = w2ui.foo;

                event.onComplete = function () {
                    if (editMode) {
                        var sel = grid.getSelection();

                        if (sel.length == 1) {
                            form.recid = sel[0];
                            form.record = $.extend(true, {}, grid.get(sel[0]));
                            form.refresh();
                        } else {
                            form.clear();
                        }
                    }
                }
            }
        });
    }

    w2popup.open({
        title: (id == 0 ? 'Crear registro' : 'Editar registro'),
        with: 500,
        height: 240,
        body: '<div id="form" style="width: 100%; height: 100%;"></div>',
        style: 'padding: 15px 0px 0px 0px',
        showMax: true,
        onToggle: function (event) {
            $(w2ui.foo.box).hide();
            event.onComplete = function () {
                $(w2ui.foo.box).show();
                w2ui.foo.resize();
            }
        },
        onOpen: function (event) {
            event.onComplete = function () {
                // specifying an onOpen handler instead is equivalent to specifying an onBeforeOpen handler, which would make this code execute too early and hence not deliver.
                $('#w2ui-popup #form').w2render('foo');
            }
        },
        onClose: function (event) {
            event.onComplete = function () {
                w2ui['foo'].clear();
            }
        }
    })
}

function detail() {
    w2popup.open({
        title: 'Detalles del registro',
        width: 600,
        height: 300,
        showMax: true,
        body: '<div id="main" style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px;"></div>',
        onOpen: function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render('detail');
            };
        },
        onToggle: function (event) {
            event.onComplete = function () {
                w2ui.grid.resize();
            }
        }
    });
}

function DropdownPerson() {
    $('#personId')
        .attr('placeholder', 'Seleccione una persona...')
        .w2field('list', { url: '/Document/DropdownPerson', minLength: 0 });
}

function DropdownDocumentType() {
    $('#documentTypeId')
        .attr('placeholder', 'Seleccione un tipo de documento...')
        .w2field('list', { url: '/Document/DropdownDocumentType', minLength: 0 });
}