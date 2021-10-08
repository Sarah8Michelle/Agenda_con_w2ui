function openPopup(id = 0, editMode = false) {
    if (!w2ui.foo) {
        $().w2form({
            name: 'foo',
            url: {
                save: '/Order/CreateOrEdit'
            },
            style: 'border: 0px; background-color: transparent;',
            fields: [
                {
                    field: 'code', type: 'text', required: true,
                    html: {
                        group: 'Información General',
                        label: 'Código',
                        span: 7,
                        attr: 'size="30"'
                    }
                },
                {
                    field: 'personId', type: 'list', required: true,
                    html: {
                        label: 'Persona',
                        span: 7,
                        attr: 'placeholder="Seleccione una persona..."; style="width:calc(100% - 10px)"'
                    },
                    options: {
                        url: '/Order/DropdownPerson',
                        minLength: 0,
                        msgNoItems: 'No se encontraron coincidencias.'
                    }
                },
                {
                    field: 'orderDate', type: 'datetime',
                    html: {
                        label: 'Fecha de Orden',
                        span: 7,
                        attr: 'size="20"'
                    },
                    options: {
                        btn_now: true
                    }
                },
                {
                    field: 'arrivalDate', type: 'date',
                    html: {
                        group: 'Información de Envío',
                        label: 'Fecha de Entrega',
                        span: 6,
                        attr: 'size="20"'
                    }
                },
                {
                    field: 'shipCompany', type: 'text',
                    html: {
                        label: 'Compañía de Envíos',
                        span: 6,
                        attr: 'size="30"'
                    }
                },
                {
                    field: 'shipAddress', type: 'text',
                    html: {
                        label: 'Dirección',
                        span: 6,
                        attr: 'size="30"'
                    }
                },
                {
                    field: 'shipCity', type: 'text',
                    html: {
                        label: 'Ciudad',
                        span: 6,
                        attr: 'size="30"'
                    }
                },
                {
                    field: 'shipRegion', type: 'text',
                    html: {
                        label: 'Región',
                        span: 6,
                        attr: 'size="30"'
                    }
                },
                {
                    field: 'shipCountry', type: 'text',
                    html: {
                        label: 'País',
                        span: 6,
                        attr: 'size="30"'
                    }
                },
                {
                    field: 'shipPostalCode', type: 'text',
                    html: {
                        label: 'Código Postal',
                        span: 6,
                        attr: 'size="30"'
                    }
                }

            ],
            actions: {
                "Limpiar": function () { this.clear(); },
                "Guardar": function () {
                    this.save();
                    if (w2ui.foo.validate().length == 0) {
                        w2popup.close();
                    }
                }
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

                            var date = new Date(form.record.arrivalDate);
                            form.record.arrivalDate = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();

                            form.refresh();
                        } else {
                            form.clear();
                        }
                    }
                }
            },
            onSubmit: function (formName, formObj) {
                var record;

                if (editMode) {
                    record = { id: formObj.postData.record.id, code: formObj.postData.record.code, orderDate: formObj.postData.record.orderDate, arrivalDate: formObj.postData.record.arrivalDate, shipCompany: formObj.postData.record.shipCompany, shipAddress: formObj.postData.record.shipAddress, shipCity: formObj.postData.record.shipCity, shipRegion: formObj.postData.record.shipRegion, shipCountry: formObj.postData.record.shipCountry, shipPostalCode: formObj.postData.record.shipPostalCode, personId: formObj.postData.record.personId.id };
                }

                else {
                    record = { code: formObj.postData.record.code, orderDate: formObj.postData.record.orderDate, arrivalDate: formObj.postData.record.arrivalDate, shipCompany: formObj.postData.record.shipCompany, shipAddress: formObj.postData.record.shipAddress, shipCity: formObj.postData.record.shipCity, shipRegion: formObj.postData.record.shipRegion, shipCountry: formObj.postData.record.shipCountry, shipPostalCode: formObj.postData.record.shipPostalCode, personId: parseInt(formObj.postData.record.personId.id) }
                }

                $.extend(formObj.postData, record);
            }
        });
    }

    w2popup.open({
        title: (editMode == false ? 'Crear registro' : 'Editar registro'),
        width: 500,
        height: 560,
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
        height: 350,
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