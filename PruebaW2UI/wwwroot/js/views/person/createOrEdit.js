function openPopup(id = 0, editMode = false) {
    if (!w2ui.foo) {
        $().w2form({
            name: 'foo',
            url: {
                save: '/Person/CreateOrEdit'
            },
            style: 'border: 0px; background-color: transparent;',
            fields: [
                { field: 'firstName', type: 'text', required: true, html: { label: 'Nombre' } },
                { field: 'lastName', type: 'text', required: true, html: { label: 'Apellido' } },
                { field: 'dateOfBirth', type: 'date', html: { label: 'Fecha de Nacimiento', attr: 'size="10"' } }
            ],
            actions: {
                "Limpiar": function () { this.clear(); },
                "Guardar": function () { this.save(); w2popup.close(); }
            },
            onSubmit: function (formName, formObj) {
                $.extend(formObj.postData, formObj.postData.record);
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
            },
            onChange: function () {
                w2ui['foo'].record['fullName'] = w2ui.foo.record.firstName + ' ' + w2ui.foo.record.lastName;
                console.log(w2ui.foo.record);
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
                w2ui['grid'].reload();
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